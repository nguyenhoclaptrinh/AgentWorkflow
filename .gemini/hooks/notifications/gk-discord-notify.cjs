#!/usr/bin/env node
/**
 * GK Discord Notification Hook for Gemini CLI
 *
 * Sends rich Discord embed notifications when agents complete.
 * Configurable via .gk.json:
 *
 *   "notifications": {
 *     "discord": {
 *       "enabled": true,
 *       "notifyMainAgent": true,
 *       "notifySubAgentRoles": ["code-executor", "git-manager"]
 *     }
 *   }
 *
 * Payload from Gemini CLI (AfterAgent):
 *   {
 *     "session_id": "uuid",
 *     "cwd": "/path/to/project",
 *     "hook_event_name": "AfterAgent",
 *     "timestamp": "ISO8601"
 *   }
 *
 * Exit Codes:
 *   0 - Success (non-blocking, allows continuation)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sessionManager = require('../lib/gk-session-manager.cjs');
const { loadConfig } = require('../lib/gk-config-utils.cjs');

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT LOADING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Load environment variables with priority:
 * 1. process.env (highest - already loaded)
 * 2. .gemini/.env (medium)
 * 3. .gemini/hooks/notifications/.env (lowest)
 *
 * @returns {Object} Merged environment variables
 */
function loadEnv() {
  const env = { ...process.env };

  // Load in reverse priority order (lowest first, highest wins)
  const envFiles = [
    path.join(__dirname, '.env'),           // .gemini/hooks/notifications/.env
    path.join(process.cwd(), '.gemini', '.env')  // .gemini/.env
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let value = trimmed.slice(eqIdx + 1).trim();
          // Remove surrounding quotes
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          // Only set if not already in process.env (process.env has priority)
          if (!process.env[key]) {
            env[key] = value;
          }
        }
      }
    }
  }

  return env;
}

// ═══════════════════════════════════════════════════════════════════════════
// DISCORD API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send Discord embed notification
 * @param {string} webhookUrl - Discord webhook URL
 * @param {Object} embed - Discord embed object
 * @returns {Promise<void>}
 */
function sendDiscordEmbed(webhookUrl, embed) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ embeds: [embed] });
    const url = new URL(webhookUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        reject(new Error(`Discord API error: ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Build Discord embed for agent completion
 * @param {Object} data - Hook input data
 * @param {Object} session - Session data from session manager
 * @param {Object} options - { isSubAgent, agentRole }
 * @returns {Object} Discord embed object
 */
function buildEmbed(data, session, options = {}) {
  const projectDir = data.cwd || process.cwd();
  const projectName = path.basename(projectDir);
  const sessionId = data.session_id || 'unknown';
  const timestamp = new Date().toISOString();
  const { isSubAgent = false, agentRole = '' } = options;

  // Common footer
  const footer = {
    text: `Project • ${projectName}`
  };

  // Get agents from session
  const mainAgent = session?.agents?.find(a => a.agentType === 'Main Agent');
  const subAgents = session?.agents?.filter(a => a.agentType === 'Sub Agent') || [];

  // If this is a sub-agent notification, find the specific sub-agent
  let targetAgent = mainAgent;
  if (isSubAgent && sessionId) {
    const subAgent = session?.agents?.find(a => a.geminiSessionId === sessionId);
    if (subAgent) {
      targetAgent = subAgent;
    }
  }

  // Calculate duration based on target agent
  let duration = 'N/A';
  if (targetAgent?.startTime) {
    const startTime = new Date(targetAgent.startTime);
    const endTime = targetAgent.endTime ? new Date(targetAgent.endTime) : new Date();
    const durationMs = endTime - startTime;
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      duration = `${minutes}m ${seconds % 60}s`;
    } else {
      duration = `${seconds}s`;
    }
  }

  // Get active plan
  const activePlan = session?.activePlan || sessionManager.getActivePlan() || 'None';

  // Build sub-agents summary
  let subAgentsSummary = 'None';
  if (subAgents.length > 0) {
    const completed = subAgents.filter(a => a.status === 'completed').length;
    const failed = subAgents.filter(a => a.status === 'failed').length;
    subAgentsSummary = `${subAgents.length} total (${completed} completed, ${failed} failed)`;
  }

  // Determine status and color based on target agent
  const status = targetAgent?.status || 'completed';
  const isSuccess = status === 'completed';
  const color = isSuccess ? 5763719 : 15158332; // Green or Red

  // Build title based on agent type
  let title, description;
  if (isSubAgent) {
    title = isSuccess ? '✅ Sub-Agent Complete' : '❌ Sub-Agent Failed';
    description = isSuccess
      ? `Sub-agent (${agentRole || 'unknown'}) completed successfully`
      : `Sub-agent (${agentRole || 'unknown'}) ended with status: ${status}`;
  } else {
    title = isSuccess ? '✅ Gemini CLI Session Complete' : '❌ Gemini CLI Session Failed';
    description = isSuccess
      ? 'Session completed successfully'
      : `Session ended with status: ${status}`;
  }

  return {
    title,
    description,
    color,
    timestamp,
    footer,
    fields: [
      {
        name: '⏱️ Duration',
        value: duration,
        inline: true
      },
      {
        name: '🤖 Sub-Agents',
        value: subAgentsSummary,
        inline: true
      },
      {
        name: '🆔 Session',
        value: `\`${sessionId.substring(0, 8)}...\``,
        inline: true
      },
      {
        name: '📋 Active Plan',
        value: activePlan === 'None' ? 'None' : `\`${activePlan}\``,
        inline: false
      },
      {
        name: '📍 Project',
        value: `\`${projectDir}\``,
        inline: false
      }
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEDUPLICATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if notification was already sent for this session (within 60 seconds)
 * Uses temp marker file to prevent duplicate notifications
 * @param {string} sessionId - Session ID to check
 * @returns {boolean} True if already notified
 */
function wasAlreadyNotified(sessionId) {
  if (!sessionId) return false;

  const os = require('os');
  const markerPath = path.join(os.tmpdir(), `gk-discord-notified-${sessionId.substring(0, 16)}`);

  try {
    if (fs.existsSync(markerPath)) {
      const stat = fs.statSync(markerPath);
      const ageMs = Date.now() - stat.mtimeMs;
      // Consider notified if marker exists and is less than 60 seconds old
      if (ageMs < 60000) {
        return true;
      }
    }
  } catch {
    // Ignore errors
  }

  return false;
}

/**
 * Mark session as notified
 * @param {string} sessionId - Session ID to mark
 */
function markAsNotified(sessionId) {
  if (!sessionId) return;

  const os = require('os');
  const markerPath = path.join(os.tmpdir(), `gk-discord-notified-${sessionId.substring(0, 16)}`);

  try {
    fs.writeFileSync(markerPath, new Date().toISOString());
  } catch {
    // Ignore errors
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  try {
    // Load environment
    const env = loadEnv();
    const webhookUrl = env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      // Silent skip if no webhook configured
      process.exit(0);
    }

    // Read JSON input from stdin
    const stdin = fs.readFileSync(0, 'utf-8').trim();
    if (!stdin) {
      process.exit(0);
    }

    const data = JSON.parse(stdin);
    const hookEventName = data.hook_event_name || 'unknown';
    const sessionId = data.session_id || null;
    // Use env (loaded from .env files) not process.env
    const gkSessionId = data.gk_session_id || env.ACTIVE_GK_SESSION_ID || null;

    // Only process SessionEnd events
    if (hookEventName !== 'SessionEnd') {
      process.exit(0);
    }

    // Deduplication: Check if we already sent notification for this session
    const dedupeId = sessionId || gkSessionId;
    if (wasAlreadyNotified(dedupeId)) {
      console.error(`⏭️ Discord notification skipped (already sent for ${dedupeId?.substring(0, 8)}...)`);
      process.exit(0);
    }

    // Load config for notification settings
    const config = loadConfig();
    const notifyConfig = config.notifications?.discord || {};
    const notifyEnabled = notifyConfig.enabled !== false; // Default: true
    const notifyMainAgent = notifyConfig.notifyMainAgent !== false; // Default: true
    const notifySubAgentRoles = notifyConfig.notifySubAgentRoles || [];

    if (!notifyEnabled) {
      process.exit(0);
    }

    const projectDir = data.cwd || process.cwd();
    const projectName = path.basename(projectDir);

    // Get session data from session manager
    // Need projectDir and gkSessionId for proper lookup
    const { projectDir: projDir } = sessionManager.generateProjectIdentifiers(projectDir);
    let session = null;

    // Try to find session by gkSessionId first
    if (gkSessionId) {
      session = sessionManager.getSession(projDir, gkSessionId);
    }

    // Fallback: find by geminiSessionId
    if (!session && sessionId) {
      const sessionPath = sessionManager.findSessionByGeminiId(projDir, sessionId);
      if (sessionPath) {
        session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
      }
    }

    // Check if this is a sub-agent (via env var OR by checking session data)
    let isSubAgent = process.env.GEMINI_TYPE === 'sub-agent';
    let agentRole = process.env.GEMINI_AGENT_ROLE || '';

    // Additional check: if sessionId matches a sub-agent in the session, it's a sub-agent
    // This handles cases where GEMINI_TYPE wasn't properly inherited
    if (!isSubAgent && session && sessionId) {
      const matchingAgent = session.agents?.find(a => a.geminiSessionId === sessionId);
      if (matchingAgent && matchingAgent.agentType === 'Sub Agent') {
        isSubAgent = true;
        agentRole = matchingAgent.agentRole || agentRole;
        console.error(`🔍 Detected sub-agent from session data: ${agentRole}`);
      }
    }

    // Determine if we should notify
    if (isSubAgent) {
      // Sub-agent: only notify if role is in notifySubAgentRoles
      if (!notifySubAgentRoles.includes(agentRole)) {
        console.error(`⏭️ Sub-agent notification skipped (role '${agentRole}' not in notifySubAgentRoles)`);
        process.exit(0);
      }
    } else {
      // Main agent: check notifyMainAgent setting
      if (!notifyMainAgent) {
        process.exit(0);
      }
    }

    // Mark as notified BEFORE sending (to prevent race conditions)
    markAsNotified(dedupeId);

    // Build and send embed
    const embed = buildEmbed(data, session, { isSubAgent, agentRole });
    await sendDiscordEmbed(webhookUrl, embed);

    console.error(`✅ Discord notification sent for ${projectName}`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Discord notification error: ${error.message}`);
    // Non-blocking: exit 0 to not block the session
    process.exit(0);
  }
}

main();
