#!/usr/bin/env node
/**
 * GK Session End - SessionEnd Hook for Gemini-kit
 *
 * Architecture (v2.0):
 * - Data stored in: ~/.gemkit/projects/{projectDir}/
 * - Updates gk-session-{gkSessionId}.json with completion info
 * - Updates gk-project-{gkProjectHash}.json with session end info
 *
 * SessionEnd Payload (from Gemini CLI):
 *   {
 *     "session_id": "uuid",              // Gemini CLI session ID (UUID)
 *     "gk_session_id": "app-...",        // GK session ID (for non-Gemini apps)
 *     "transcript_path": "/path/to/transcript",
 *     "cwd": "/path/to/project",
 *     "hook_event_name": "SessionEnd",
 *     "timestamp": "ISO8601",
 *     "exit_code": 0,
 *     "exit_reason": "user_exit" | "error" | "completed"
 *   }
 *
 * Supports:
 *   - Gemini CLI apps: Uses session_id (UUID) to find session
 *   - Non-Gemini apps: Uses gk_session_id directly, or reads from .env
 *
 * Exit Codes:
 *   0 - Success (non-blocking)
 */

const fs = require('fs');
const path = require('path');
const sessionManager = require('./lib/gk-session-manager.cjs');

// Import token usage reader from check_agent_activity
let getAgentTokenUsage = null;
try {
  getAgentTokenUsage = require('../extensions/spawn-agent/scripts/check_agent_activity.js').getAgentTokenUsage;
} catch (e) {
  // Extension not available - tokenUsage will remain null
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine if session was successful based on exit info
 * @param {Object} data Hook payload
 * @returns {boolean} True if session succeeded
 */
function determineSuccess(data) {
  if (typeof data.exit_code === 'number') {
    return data.exit_code === 0;
  }

  if (data.exit_reason) {
    const failReasons = ['error', 'crash', 'timeout', 'killed'];
    return !failReasons.includes(data.exit_reason.toLowerCase());
  }

  return true;
}

/**
 * Extract error message from payload
 * @param {Object} data Hook payload
 * @returns {string|null} Error message or null
 */
function extractError(data) {
  if (data.error) return data.error;
  if (data.error_message) return data.error_message;

  if (data.exit_reason && data.exit_reason.toLowerCase() === 'error') {
    return `Session ended with error (exit_reason: ${data.exit_reason})`;
  }

  if (typeof data.exit_code === 'number' && data.exit_code !== 0) {
    return `Session ended with exit code ${data.exit_code}`;
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HOOK EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf-8').trim();
    const data = stdin ? JSON.parse(stdin) : {};

    const geminiSessionId = data.session_id || null;
    const gkSessionIdFromPayload = data.gk_session_id || null;
    const cwd = data.cwd || process.cwd();
    const hookEventName = data.hook_event_name || 'SessionEnd';

    // Only process SessionEnd events
    if (hookEventName !== 'SessionEnd') {
      process.exit(0);
    }

    // Get project identifiers
    const { projectDir } = sessionManager.generateProjectIdentifiers(cwd);

    // Check if this is a sub-agent FIRST (before session lookup)
    const isSubAgent = process.env.GEMINI_TYPE === 'sub-agent';
    const geminiParentId = process.env.GEMINI_PARENT_SESSION_ID || null;
    const gkParentId = process.env.GK_PARENT_SESSION_ID || null;

    // Determine success/failure
    const success = determineSuccess(data);
    const exitCode = typeof data.exit_code === 'number' ? data.exit_code : (success ? 0 : 1);
    const error = extractError(data);

    // ═══════════════════════════════════════════════════════════════════════
    // SUB-AGENT: Update in parent's session, NOT own session
    // Handle sub-agents FIRST before any session lookup
    // ═══════════════════════════════════════════════════════════════════════
    if (isSubAgent && (geminiParentId || gkParentId)) {
      let parentSession = null;
      let parentGkSessionId = gkParentId;

      // Try to find parent session by gkSessionId first
      if (gkParentId) {
        parentSession = sessionManager.getSession(projectDir, gkParentId);
      }

      // Fallback: find by geminiSessionId
      if (!parentSession && geminiParentId) {
        const parentSessionPath = sessionManager.findSessionByGeminiId(projectDir, geminiParentId);
        if (parentSessionPath) {
          parentSession = JSON.parse(fs.readFileSync(parentSessionPath, 'utf8'));
          parentGkSessionId = parentSession.gkSessionId;
        }
      }

      if (parentSession && parentGkSessionId) {
        // Find this sub-agent in parent's agents array by geminiSessionId
        const subAgent = parentSession.agents?.find(a => a.geminiSessionId === geminiSessionId);

        if (subAgent) {
          // Read token usage from Gemini's session file
          let tokenUsage = null;
          if (getAgentTokenUsage && geminiSessionId && subAgent.geminiProjectHash) {
            tokenUsage = getAgentTokenUsage(geminiSessionId, subAgent.geminiProjectHash);
          }

          sessionManager.endAgent(projectDir, parentGkSessionId, subAgent.gkSessionId, {
            status: success ? 'completed' : 'failed',
            exitCode: exitCode,
            error: error,
            tokenUsage: tokenUsage  // Store token usage on completion
          });

          const agentRole = process.env.GEMINI_AGENT_ROLE || subAgent.agentRole || 'sub-agent';
          const status = success ? 'completed' : 'failed';
          const tokens = tokenUsage?.total ? ` | Tokens: ${tokenUsage.total.toLocaleString()}` : '';
          console.log(`Sub-agent ${status}. Role: ${agentRole}${tokens}`);
        }
      }
      process.exit(0);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN AGENT: Session lookup and end handling
    // ═══════════════════════════════════════════════════════════════════════

    // Try to get gkSessionId from multiple sources:
    // 1. Payload gk_session_id (non-Gemini apps)
    // 2. .env ACTIVE_GK_SESSION_ID (fallback)
    // 3. Find by geminiSessionId (Gemini CLI apps)
    let gkSessionId = gkSessionIdFromPayload;
    let session = null;

    if (!gkSessionId) {
      // Try .env fallback for non-Gemini apps
      const env = sessionManager.readEnv();
      gkSessionId = env.ACTIVE_GK_SESSION_ID || null;
    }

    if (gkSessionId) {
      // Direct lookup by gkSessionId (non-Gemini apps)
      session = sessionManager.getSession(projectDir, gkSessionId);
    }

    if (!session && geminiSessionId) {
      // Find by Gemini session ID (Gemini CLI apps)
      const sessionPath = sessionManager.findSessionByGeminiId(projectDir, geminiSessionId);
      if (sessionPath) {
        session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
        gkSessionId = session.gkSessionId;
      }
    }

    // No session found - exit silently
    if (!session || !gkSessionId) {
      process.exit(0);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN AGENT: Full session end handling
    // ═══════════════════════════════════════════════════════════════════════

    // End session
    sessionManager.endSession(projectDir, gkSessionId, {
      status: success ? 'completed' : 'failed',
      exitCode: exitCode,
      error: error
    });

    // Get updated session for output
    const updatedSession = sessionManager.getSession(projectDir, gkSessionId);
    const mainAgent = updatedSession?.agents?.find(a => a.agentRole === 'main' || a.agentType === 'Main Agent');

    // Output status
    const duration = updatedSession?.endTime && updatedSession?.startTime
      ? Math.round((new Date(updatedSession.endTime) - new Date(updatedSession.startTime)) / 1000)
      : 0;
    const status = success ? 'completed' : 'failed';
    console.log(`Session ${status}. Duration: ${duration}s | ID: ${gkSessionId.substring(0, 20)}...`);

    process.exit(0);
  } catch (error) {
    console.error(`Session end hook error: ${error.message}`);
    process.exit(0);
  }
}

main();