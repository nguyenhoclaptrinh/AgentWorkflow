#!/usr/bin/env node
/**
 * GK Session Init - SessionStart/BeforeAgent/BeforeModel Hook for Gemini-kit
 *
 * Architecture (v2.0):
 * - Data stored in: ~/.gemkit/projects/{projectDir}/
 * - gk-session-{gkSessionId}.json - Session files (gkSessionId = {appName}-{PID}-{ts36}-{rand4})
 * - gk-project-{gkProjectHash}.json - Project files (gkProjectHash = 16-char SHA-256)
 * - .gemini/.env - Stable interface for current session state
 *
 * Sub-agents are tracked in their parent's gk-session file, not in separate files.
 *
 * Behavior:
 * - SessionStart: Full session initialization (MAIN AGENTS ONLY)
 * - BeforeAgent: Capture main agent prompt + fallback init
 * - BeforeModel: Capture Gemini's projectHash (once, if not already captured)
 *
 * Exit Codes:
 *   0 - Success (non-blocking, allows continuation)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { loadConfig, resolvePlanPath, getReportsPath } = require('./lib/gk-config-utils.cjs');
const sessionManager = require('./lib/gk-session-manager.cjs');

// ═══════════════════════════════════════════════════════════════════════════
// GEMINI PROJECT HASH EXTRACTION (from BeforeModel llm_request)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract Gemini's projectHash from BeforeModel llm_request
 * @param {Object} payload - stdin JSON from hook
 * @returns {string|null} projectHash (64-char hex) or null
 */
function extractGeminiProjectHash(payload) {
  if (!payload.llm_request?.messages?.length) return null;

  const systemMsg = payload.llm_request.messages[0]?.content || '';
  const match = systemMsg.match(/\.gemini[\\\/]tmp[\\\/]([a-f0-9]{64})/i);

  return match ? match[1] : null;
}

/**
 * Extract full projectTempDir path from BeforeModel llm_request
 * @param {Object} payload - stdin JSON from hook
 * @returns {string|null} Full path or null
 */
function extractGeminiTempDir(payload) {
  if (!payload.llm_request?.messages?.length) return null;

  const systemMsg = payload.llm_request.messages[0]?.content || '';
  const match = systemMsg.match(/The project's temporary directory is:\s*([^\n]+)/i);

  return match ? match[1].trim() : null;
}

/**
 * Extract prompt from BeforeAgent hook
 * @param {Object} payload - stdin JSON from hook
 * @returns {string|null} Prompt (truncated to 150 chars) or null
 */
function extractFirstUserPrompt(payload) {
  if (payload.hook_event_name === 'BeforeAgent' && payload.prompt) {
    const content = payload.prompt;
    return content.length > 150 ? content.substring(0, 150) : content;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function execSafe(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    return null;
  }
}

function getPythonVersion() {
  const commands = ['python3 --version', 'python --version'];
  for (const cmd of commands) {
    const result = execSafe(cmd);
    if (result) return result;
  }
  return null;
}

function getGitRemoteUrl() {
  return execSafe('git config --get remote.origin.url');
}

function getGitBranch() {
  return execSafe('git branch --show-current');
}

function detectProjectType(configOverride) {
  if (configOverride && configOverride !== 'auto') return configOverride;

  if (fs.existsSync('pnpm-workspace.yaml')) return 'monorepo';
  if (fs.existsSync('lerna.json')) return 'monorepo';

  if (fs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (pkg.workspaces) return 'monorepo';
      if (pkg.main || pkg.exports) return 'library';
    } catch (e) { /* ignore */ }
  }

  return 'single-repo';
}

function detectPackageManager(configOverride) {
  if (configOverride && configOverride !== 'auto') return configOverride;

  if (fs.existsSync('bun.lockb')) return 'bun';
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  if (fs.existsSync('package-lock.json')) return 'npm';

  return null;
}

function detectFramework(configOverride) {
  if (configOverride && configOverride !== 'auto') return configOverride;
  if (!fs.existsSync('package.json')) return null;

  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps['next']) return 'next';
    if (deps['nuxt']) return 'nuxt';
    if (deps['astro']) return 'astro';
    if (deps['@remix-run/node'] || deps['@remix-run/react']) return 'remix';
    if (deps['svelte'] || deps['@sveltejs/kit']) return 'svelte';
    if (deps['vue']) return 'vue';
    if (deps['react']) return 'react';
    if (deps['express']) return 'express';
    if (deps['fastify']) return 'fastify';
    if (deps['hono']) return 'hono';
    if (deps['elysia']) return 'elysia';

    return null;
  } catch (e) {
    return null;
  }
}

function buildContextOutput(config, detections, resolved) {
  const lines = [`Project: ${detections.type || 'unknown'}`];
  if (detections.pm) lines.push(`PM: ${detections.pm}`);
  if (detections.framework) lines.push(`Framework: ${detections.framework}`);
  lines.push(`Plan naming: ${config.plan.namingFormat}`);

  if (resolved.path) {
    if (resolved.resolvedBy === 'session') {
      lines.push(`Plan: ${resolved.path}`);
    } else {
      lines.push(`Suggested: ${resolved.path}`);
    }
  }

  return lines.join(' | ');
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HOOK EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf-8').trim();
    const data = stdin ? JSON.parse(stdin) : {};

    const geminiSessionId = data.session_id || null;
    const cwd = data.cwd || process.cwd();
    const hookEventName = data.hook_event_name || 'BeforeAgent';
    const timestamp = data.timestamp || new Date().toISOString();

    // Sub-agent detection from environment
    const isSubAgent = process.env.GEMINI_TYPE === 'sub-agent';
    const geminiParentSessionId = process.env.GEMINI_PARENT_SESSION_ID || null;  // geminiSessionId (UUID)
    const gkParentSessionId = process.env.GK_PARENT_SESSION_ID || null;          // gkSessionId
    const agentRole = process.env.GEMINI_AGENT_ROLE || 'main';
    const agentPrompt = process.env.GEMINI_AGENT_PROMPT || null;
    const agentModel = process.env.GEMINI_AGENT_MODEL || null;
    // Injected skills/context for tracking (to avoid duplicate injection on resume)
    const agentSkillsEnv = process.env.GEMINI_AGENT_SKILLS || '';
    const agentContextEnv = process.env.GEMINI_AGENT_CONTEXT || '';
    const agentInjected = (agentSkillsEnv || agentContextEnv) ? {
      skills: agentSkillsEnv ? agentSkillsEnv.split(',').filter(s => s) : [],
      context: agentContextEnv ? agentContextEnv.split(',').filter(c => c) : []
    } : null;
    // Pre-generated session ID from gk agent spawn (to avoid duplicate agents)
    const preGeneratedSubSessionId = process.env.GK_SUB_SESSION_ID || null;

    // Get project identifiers
    const { projectDir, gkProjectHash } = sessionManager.generateProjectIdentifiers(cwd);

    // ═══════════════════════════════════════════════════════════════════════
    // SUB-AGENT: Only add to parent's session, do NOT create own session file
    // ═══════════════════════════════════════════════════════════════════════
    if (isSubAgent && (gkParentSessionId || geminiParentSessionId)) {
      let parentGkSessionId = gkParentSessionId;
      let parentSession = null;

      // Try to find parent session
      if (gkParentSessionId) {
        // Direct lookup by gkSessionId (preferred)
        parentSession = sessionManager.getSession(projectDir, gkParentSessionId);
      }

      if (!parentSession && geminiParentSessionId) {
        // Fallback: find by geminiSessionId
        const parentSessionPath = sessionManager.findSessionByGeminiId(projectDir, geminiParentSessionId);
        if (parentSessionPath) {
          parentSession = JSON.parse(fs.readFileSync(parentSessionPath, 'utf8'));
          parentGkSessionId = parentSession.gkSessionId;
        }
      }

      if (parentSession && parentGkSessionId) {
        // Check if sub-agent with this geminiSessionId already exists (avoid duplicates)
        const existingAgents = parentSession.agents || [];
        const alreadyExists = existingAgents.some(
          agent => agent.geminiSessionId === geminiSessionId && agent.agentRole !== 'main'
        );

        // Also check if agent with pre-generated ID exists (from gk agent spawn)
        const preGenExists = preGeneratedSubSessionId && existingAgents.some(
          agent => agent.gkSessionId === preGeneratedSubSessionId
        );

        if (alreadyExists || preGenExists) {
          // Sub-agent already registered (BeforeAgent/BeforeModel called after SessionStart)
          // Or pre-registered by gk agent spawn - just update with geminiSessionId
          if (preGenExists && !alreadyExists) {
            // Update the pre-registered agent with geminiSessionId
            sessionManager.updateAgentGeminiSession(projectDir, parentGkSessionId, preGeneratedSubSessionId, geminiSessionId);
          }
          // For BeforeModel: DON'T exit - fall through to capture geminiProjectHash
          if (hookEventName !== 'BeforeModel') {
            process.exit(0);
          }
          // BeforeModel will be handled below - don't register again, just fall through
        } else {
          // First time registration (SessionStart)
          // Use pre-generated ID if available, otherwise generate new one
          const parentPid = parentSession.pid;
          const subAgentGkSessionId = preGeneratedSubSessionId || sessionManager.generateGkSessionId('gemini-sub', parentPid);

          // Resolve geminiProjectHash with priority:
          // 1. .env GEMINI_PROJECT_HASH (if exists)
          // 2. Parent session geminiProjectHash
          // 3. null (will be captured by BeforeModel hook later)
          const currentEnv = sessionManager.readEnv();
          const envGeminiProjectHash = currentEnv.GEMINI_PROJECT_HASH || null;
          const parentGeminiProjectHash = parentSession.geminiProjectHash || null;
          const resolvedGeminiProjectHash = envGeminiProjectHash || parentGeminiProjectHash || null;

          // Add sub-agent to parent's session
          sessionManager.addAgent(projectDir, parentGkSessionId, {
            gkSessionId: subAgentGkSessionId,
            pid: parentPid,
            geminiSessionId: geminiSessionId,
            geminiProjectHash: resolvedGeminiProjectHash,  // Priority: .env > parent > null
            parentGkSessionId: parentGkSessionId,
            agentRole: agentRole,
            prompt: agentPrompt,
            model: agentModel,
            injected: agentInjected  // Track what was injected to avoid duplication on resume
          });

          console.log(`Sub-agent started. Role: ${agentRole} | Model: ${agentModel || 'default'}`);
          process.exit(0);
        }
      } else {
        console.log(`Sub-agent warning: Parent session not found`);
        process.exit(0);
      }
      // If we get here, it's BeforeModel for existing sub-agent - fall through to BeforeModel handling
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN AGENT: Full session initialization
    // ═══════════════════════════════════════════════════════════════════════

    // Try to find existing session by Gemini session ID (resume case)
    const existingSessionPath = sessionManager.findSessionByGeminiId(projectDir, geminiSessionId);
    let existingSession = null;
    let existingGkSessionId = null;

    if (existingSessionPath) {
      existingSession = JSON.parse(fs.readFileSync(existingSessionPath, 'utf8'));
      existingGkSessionId = existingSession.gkSessionId;
    }

    // BEFOREAGENT: Capture main agent prompt (first time only)
    if (hookEventName === 'BeforeAgent') {
      if (existingSession && existingGkSessionId) {
        const firstUserPrompt = extractFirstUserPrompt(data);
        if (firstUserPrompt) {
          sessionManager.updateAgentPrompt(projectDir, existingGkSessionId, existingGkSessionId, firstUserPrompt);
        }
      }

      // If already initialized, exit after capturing prompt
      if (existingSession && existingSession.initialized) {
        process.exit(0);
      }
    }

    // BEFOREMODEL: Capture Gemini's projectHash and tempDir
    if (hookEventName === 'BeforeModel') {
      // Extract projectHash early - needed for both sub-agent and main agent paths
      const geminiProjectHash = extractGeminiProjectHash(data);
      const geminiTempDir = extractGeminiTempDir(data);

      // SUB-AGENT: Update agent entry AND parent session with geminiProjectHash
      if (isSubAgent && gkParentSessionId && geminiProjectHash) {
        sessionManager.captureAgentProjectHash(
          projectDir,
          gkParentSessionId,
          geminiSessionId,
          geminiProjectHash
        );

        // Also update .env if GEMINI_PROJECT_HASH is empty
        const currentEnv = sessionManager.readEnv();
        if (!currentEnv.GEMINI_PROJECT_HASH) {
          sessionManager.updateEnv({
            gkSessionId: currentEnv.ACTIVE_GK_SESSION_ID,
            gkProjectHash: currentEnv.GK_PROJECT_HASH,
            projectDir: currentEnv.PROJECT_DIR,
            geminiSessionId: currentEnv.ACTIVE_GEMINI_SESSION_ID,
            geminiProjectHash: geminiProjectHash,
            activePlan: currentEnv.ACTIVE_PLAN,
            suggestedPlan: currentEnv.SUGGESTED_PLAN,
            planDateFormat: currentEnv.PLAN_DATE_FORMAT
          });
        }

        process.exit(0);
      }

      // MAIN AGENT: Standard capture flow
      if (!existingSession || !existingSession.initialized) {
        process.exit(0);
      }

      // Skip if fully captured
      if (existingSession.geminiProjectHash && existingSession.geminiTempDir && existingSession.geminiProjectHashCapturedAt) {
        process.exit(0);
      }

      // Capture for main agent
      if (geminiProjectHash || geminiTempDir) {
        sessionManager.captureGeminiProjectHash(projectDir, existingGkSessionId, geminiProjectHash, geminiTempDir);
      }

      process.exit(0);
    }

    // SESSIONSTART / BEFOREAGENT FALLBACK: Handle resume or exit
    if (existingSession && existingSession.initialized) {
      // Session already initialized - this is a RESUME
      // Update .env to reflect the resumed session (important when switching between sessions)
      if (hookEventName === 'SessionStart') {
        const currentEnv = sessionManager.readEnv();
        sessionManager.updateEnv({
          gkSessionId: existingGkSessionId,
          gkProjectHash: existingSession.gkProjectHash,
          projectDir: existingSession.projectDir,
          geminiSessionId: geminiSessionId,  // The resumed session's ID
          geminiProjectHash: existingSession.geminiProjectHash || currentEnv.GEMINI_PROJECT_HASH || '',
          activePlan: existingSession.activePlan || '',
          suggestedPlan: existingSession.suggestedPlan || '',
          planDateFormat: existingSession.planDateFormat || ''
        });
        console.log(`Session resumed. ID: ${existingGkSessionId.substring(0, 20)}...`);
      }
      process.exit(0);
    }

    // === FIRST RUN: Initialize main agent session ===

    const config = loadConfig();

    const detections = {
      type: detectProjectType(config.project?.type),
      pm: detectPackageManager(config.project?.packageManager),
      framework: detectFramework(config.project?.framework)
    };

    // Resolve plan path (using null for sessionId since we haven't created one yet)
    const resolved = resolvePlanPath(null, config);
    const reportsPath = getReportsPath(resolved.path, resolved.resolvedBy, config.plan, config.paths);

    const staticEnv = {
      nodeVersion: process.version,
      pythonVersion: getPythonVersion(),
      osPlatform: process.platform,
      gitUrl: getGitRemoteUrl(),
      gitBranch: getGitBranch(),
      user: process.env.USERNAME || process.env.USER || process.env.LOGNAME || os.userInfo().username,
      locale: process.env.LANG || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      geminiSettingsDir: path.resolve(__dirname, '..')
    };

    // Build initial state for session
    const initialState = {
      // Plan config
      planNamingFormat: config.plan.namingFormat,
      planDateFormat: config.plan.dateFormat,
      planIssuePrefix: config.plan.issuePrefix || '',
      planReportsDir: config.plan.reportsDir,

      // Plan resolution
      reportsPath: reportsPath,

      // Paths
      docsPath: config.paths.docs,
      plansPath: config.paths.plans,
      projectRoot: cwd,

      // Project detection
      projectType: detections.type || '',
      packageManager: detections.pm || '',
      framework: detections.framework || '',

      // Static environment
      nodeVersion: staticEnv.nodeVersion,
      pythonVersion: staticEnv.pythonVersion || '',
      osPlatform: staticEnv.osPlatform,
      gitUrl: staticEnv.gitUrl || '',
      gitBranch: staticEnv.gitBranch || '',
      user: staticEnv.user,
      locale: staticEnv.locale,
      timezone: staticEnv.timezone,
      geminiSettingsDir: staticEnv.geminiSettingsDir,

      // Locale config
      responseLanguage: config.locale?.responseLanguage || null,

      // User assertions
      assertions: config.assertions || []
    };

    // Initialize session using new API
    const { session, gkSessionId, isResume } = sessionManager.initializeGeminiSession(
      geminiSessionId,
      geminiParentSessionId,  // geminiSessionId of parent (for native Gemini sub-agents)
      {
        cwd: cwd,
        activePlan: resolved.resolvedBy === 'session' ? resolved.path : null,
        suggestedPlan: resolved.resolvedBy === 'branch' ? resolved.path : null,
        planDateFormat: config.plan.dateFormat,
        initialState: initialState
      }
    );

    // Add main agent entry to own session
    sessionManager.addAgent(projectDir, gkSessionId, {
      gkSessionId: gkSessionId,
      geminiSessionId: geminiSessionId,
      parentGkSessionId: null,
      agentRole: 'main',
      prompt: null, // Will be captured by BeforeAgent
      model: null
    });

    // Output context message
    const sessionType = isResume ? 'Session resumed' : 'Session initialized';
    console.log(`${sessionType}. ${buildContextOutput(config, detections, resolved)}`);

    if (config.assertions?.length > 0) {
      console.log(`\nUser Assertions:`);
      config.assertions.forEach((assertion, i) => {
        console.log(`  ${i + 1}. ${assertion}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error(`Session init hook error: ${error.message}`);
    process.exit(0);
  }
}

main();