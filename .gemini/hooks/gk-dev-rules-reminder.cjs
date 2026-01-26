#!/usr/bin/env node
/**
 * GK Development Rules Reminder - BeforeAgent Hook (Hybrid Detection)
 *
 * GEMINI-KIT ADAPTATION:
 * - Hook event: UserPromptSubmit → BeforeAgent
 * - sessionId: stdin JSON (data.session_id)
 * - Paths: .gemini/
 * - Config: gk-config-utils.cjs
 * - Skip logic: HYBRID approach
 *   1. Try content-based detection via chat files (if projectHash available)
 *
 * Injects context: session info, rules, modularization reminders, and Plan Context.
 *
 * OUTPUT FORMAT (Critical for Gemini CLI):
 *   Gemini CLI expects JSON with hookSpecificOutput.additionalContext:
 *   {
 *     "decision": "allow",
 *     "hookSpecificOutput": {
 *       "hookEventName": "BeforeAgent",
 *       "additionalContext": "## Session\n## Rules\n..."
 *     }
 *   }
 *   Plain text stdout is NOT captured by Gemini CLI for context injection.
 *
 * Exit Codes:
 *   0 - Success (non-blocking, allows continuation)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const {
  loadConfig,
  resolvePlanPath,
  getReportsPath,
  readSessionState,
  writeSessionState
} = require('./lib/gk-config-utils.cjs');
const sessionManager = require('./lib/gk-session-manager.cjs');

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT-BASED DETECTION (via Gemini chat files)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Content-based detection using Gemini chat files
 * Checks if marker string exists in recent USER messages (injected via hooks)
 * Only inject if marker is missing from last 5 user messages to avoid context pollution
 *
 * @param {string} sessionId - Session identifier
 * @param {string} projectHash - Project hash from session state
 * @returns {boolean|null} true=skip, false=inject, null=couldn't determine
 */
function wasRecentlyInjectedViaChatFiles(sessionId, projectHash) {
  if (!sessionId || !projectHash) return null;

  try {
    // Build path to chat directory
    const chatDir = path.join(os.homedir(), '.gemini', 'tmp', projectHash, 'chats');
    if (!fs.existsSync(chatDir)) return null;

    // Find session file (first 8 chars of sessionId in filename)
    const sessionId8 = sessionId.substring(0, 8);
    const files = fs.readdirSync(chatDir)
      .filter(f => f.endsWith('.json') && f.includes(sessionId8))
      .sort();  // Chronological order

    if (files.length === 0) return null;

    // Read most recent matching file
    const chatFile = path.join(chatDir, files[files.length - 1]);
    const chatData = JSON.parse(fs.readFileSync(chatFile, 'utf8'));

    if (!chatData.messages || !Array.isArray(chatData.messages)) return null;

    // Get last 5 USER messages (marker is injected in user messages via hooks)
    const MARKER = '[IMPORTANT] Consider Modularization';
    const userMessages = chatData.messages
      .filter(msg => msg.type === 'user')
      .slice(-5);

    // Skip injection if marker found in any of last 5 user messages
    return userMessages.some(msg =>
      typeof msg.content === 'string' &&
      msg.content.includes(MARKER)
    );
  } catch (e) {
    // Any error: return null to fall back to timestamp
    return null;
  }
}

/**
 * Try content-based detection (accurate, like Claude)
 *
 * @param {string} sessionId - Session identifier
 * @returns {boolean} True if should skip injection
 */
function wasRecentlyInjected(sessionId) {
  if (!sessionId) return false;

  const state = readSessionState(sessionId);

  // Try content-based detection first (if projectHash available)
  if (state?.projectHash) {
    const chatResult = wasRecentlyInjectedViaChatFiles(sessionId, state.projectHash);
    if (chatResult !== null) {
      return chatResult;  // Definitive answer from chat files
    }
    // null = couldn't determine, fall through to timestamp
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function execSafe(cmd) {
  // Whitelist safe read-only commands
  const allowedCommands = ['git branch --show-current'];
  if (!allowedCommands.includes(cmd)) return null;

  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    return null;
  }
}

function resolveWorkflowPath(filename) {
  // Check local then global .gemini/workflows
  const localPath = path.join(process.cwd(), '.gemini', 'workflows', filename);
  const globalPath = path.join(os.homedir(), '.gemini', 'workflows', filename);
  if (fs.existsSync(localPath)) return `.gemini/workflows/${filename}`;
  if (fs.existsSync(globalPath)) return `~/.gemini/workflows/${filename}`;
  return null;
}

function resolveScriptPath(filename) {
  // Check local then global .gemini/scripts
  const localPath = path.join(process.cwd(), '.gemini', 'scripts', filename);
  const globalPath = path.join(os.homedir(), '.gemini', 'scripts', filename);
  if (fs.existsSync(localPath)) return `.gemini/scripts/${filename}`;
  if (fs.existsSync(globalPath)) return `~/.gemini/scripts/${filename}`;
  return null;
}

function buildPlanContext(sessionId, config) {
  const { plan, paths } = config;
  const gitBranch = execSafe('git branch --show-current');
  const resolved = resolvePlanPath(sessionId, config);
  const reportsPath = getReportsPath(resolved.path, resolved.resolvedBy, plan, paths);

  const planLine = resolved.resolvedBy === 'session'
    ? `- Plan: ${resolved.path}`
    : resolved.resolvedBy === 'branch'
      ? `- Plan: none | Suggested: ${resolved.path}`
      : `- Plan: none`;

  return { reportsPath, gitBranch, planLine };
}

/**
 * Update session state with last reminder timestamp
 * Skip for sub-agents to avoid creating session files
 * @param {string} sessionId - Session identifier
 */
function markReminderInjected(sessionId) {
  if (!sessionId) return;

  // Sub-agents should not create session files
  const isSubAgent = process.env.GEMINI_TYPE === 'sub-agent';
  if (isSubAgent) return;

  const state = readSessionState(sessionId) || {};
  state.lastReminderTimestamp = new Date().toISOString();
  writeSessionState(sessionId, state);
}

// ═══════════════════════════════════════════════════════════════════════════
// REMINDER TEMPLATE (all output in one place for visibility)
// ═══════════════════════════════════════════════════════════════════════════

function buildReminder({ responseLanguage, instructionsFile, devRulesPath, catalogScript, reportsPath, plansPath, docsPath, planLine, gitBranch, dateFormat }) {
  return [
    // ─────────────────────────────────────────────────────────────────────────
    // RESPONSE LANGUAGE (if configured)
    // ─────────────────────────────────────────────────────────────────────────
    ...(responseLanguage ? [
      `## Response Language`,
      `Respond in ${responseLanguage}.`,
      ``
    ] : []),

    // ─────────────────────────────────────────────────────────────────────────
    // SESSION CONTEXT
    // ─────────────────────────────────────────────────────────────────────────
    `## Session`,
    `- DateTime: ${new Date().toLocaleString()}`,
    `- CWD: ${process.cwd()}`,
    ``,

    // ─────────────────────────────────────────────────────────────────────────
    // RULES
    // ─────────────────────────────────────────────────────────────────────────
    `## Rules`,
    ...(devRulesPath ? [`- Read and follow development rules: @"${devRulesPath}"`] : []),
    `- Markdown files are organized in: Plans → "plans/" directory, Docs → "docs/" directory`,
    `- **IMPORTANT:** DO NOT create markdown files out of "plans/" or "docs/" directories UNLESS the user explicitly requests it.`,
    `- When extensions' scripts are failed to execute, always fix them and run again, repeat until success.`,
    `- Follow **YAGNI (You Aren't Gonna Need It) - KISS (Keep It Simple, Stupid) - DRY (Don't Repeat Yourself)** principles`,
    `- Sacrifice grammar for the sake of concision when writing reports.`,
    `- In reports, list any unresolved questions at the end, if any.`,
    `- IMPORTANT: Ensure token consumption efficiency while maintaining high quality.`,
    `- Date format for plan/report naming: \`${dateFormat}\``,
    ``,
    // ─────────────────────────────────────────────────────────────────────────
    // PATHS
    // ─────────────────────────────────────────────────────────────────────────
    `## Paths`,
    `Reports: ${reportsPath} | Plans: ${plansPath}/ | Docs: ${docsPath}/`,
    ``,

    // ─────────────────────────────────────────────────────────────────────────
    // PLAN CONTEXT
    // ─────────────────────────────────────────────────────────────────────────
    `## Plan Context`,
    planLine,
    `- Reports: ${reportsPath}`,
    ...(gitBranch ? [`- Branch: ${gitBranch}`] : []),

    // ─────────────────────────────────────────────────────────────────────────
    // GEMINI.md Guidance
    // ─────────────────────────────────────────────────────────────────────────
    ...(instructionsFile ? [`- **FIRST READ** and **MUST COMPLY** all instruction in project @./${instructionsFile}`] : [])
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf-8').trim();
    if (!stdin) process.exit(0);

    const payload = JSON.parse(stdin);

    // Get sessionId from stdin JSON (Gemini-kit approach)
    // Unlike Claude Code, we don't have process.env.CK_SESSION_ID
    const sessionId = payload.session_id || null;

    // Get gkSessionId from .env for session state storage
    const env = sessionManager.readEnv();
    const gkSessionId = env.ACTIVE_GK_SESSION_ID || null;

    // Skip if recently injected (within 2 minutes) - use gkSessionId for state lookup
    if (wasRecentlyInjected(gkSessionId)) {
      process.exit(0);
    }

    const config = loadConfig({ includeProject: true, includeAssertions: false });
    const devRulesPath = resolveWorkflowPath('development-rules.md');
    const catalogScript = resolveScriptPath('generate_catalogs.py');
    const { reportsPath, gitBranch, planLine } = buildPlanContext(gkSessionId, config);

    const output = buildReminder({
      responseLanguage: config.locale?.responseLanguage,
      instructionsFile: config.project?.instructionsFile,
      devRulesPath,
      catalogScript,
      reportsPath,
      plansPath: config.paths?.plans || 'plans',
      docsPath: config.paths?.docs || 'docs',
      planLine,
      gitBranch,
      dateFormat: config.plan?.dateFormat || 'YYMMDD-HHmm'
    });

    // Output JSON format - Gemini CLI expects this structure
    // The additionalContext will be injected into the LLM context
    const hookOutput = {
      decision: "allow",
      hookSpecificOutput: {
        hookEventName: "BeforeAgent",
        additionalContext: output.join('\n')
      }
    };
    console.log(JSON.stringify(hookOutput));

    // Mark reminder as injected (for skip logic)
    markReminderInjected(gkSessionId);

    process.exit(0);
  } catch (error) {
    // Non-blocking: log error but don't fail
    console.error(`GK dev rules hook error: ${error.message}`);
    process.exit(0);
  }
}

main();