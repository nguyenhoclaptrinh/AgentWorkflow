/**
 * GK Session Manager - Unified session and project management
 *
 * Architecture (v2.0 - Refactored):
 * - Data stored in: ~/.gemkit/projects/{projectDir}/
 * - gk-session-{gkSessionId}.json - Session files
 * - gk-project-{gkProjectHash}.json - Project files
 * - .gemini/.env - Stable interface for current session state
 *
 * ID Strategy:
 * - gkSessionId: {appName}-{PID}-{ts36}-{rand4} (GemKit's own ID)
 * - gkProjectHash: SHA-256 (16 chars) of projectDir
 * - geminiSessionId: Gemini CLI's UUID (mapped, not used as primary)
 * - geminiProjectHash: Gemini CLI's 64-char hash (mapped)
 *
 * Sub-agents are tracked in their parent's gk-session file, not in separate files.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

// ═══════════════════════════════════════════════════════════════════════════
// PROCESS UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get parent PID and process name on Windows using CIM
 * @param {number} pid
 * @returns {{ parentPid: number|null, processName: string|null }}
 */
function getProcessInfoWin32(pid) {
  try {
    const cmd = `powershell -Command "$p = Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}'; Write-Output $p.ParentProcessId; Write-Output $p.Name"`;
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    const lines = output.split(/\r?\n/);
    const parentPid = parseInt(lines[0], 10);
    const processName = lines[1] || null;
    return {
      parentPid: (!isNaN(parentPid) && parentPid > 0) ? parentPid : null,
      processName: processName
    };
  } catch (e) {
    return { parentPid: null, processName: null };
  }
}

/**
 * Check if a process name is a shell
 * @param {string} name
 * @returns {boolean}
 */
function isShellProcess(name) {
  if (!name) return false;
  const shellNames = ['powershell.exe', 'pwsh.exe', 'cmd.exe', 'bash.exe', 'zsh.exe', 'sh.exe', 'fish.exe'];
  return shellNames.includes(name.toLowerCase());
}

/**
 * Check if a process name is an IDE/terminal host
 * @param {string} name
 * @returns {boolean}
 */
function isIDEProcess(name) {
  if (!name) return false;
  const lowerName = name.toLowerCase();
  const ideNames = [
    // VS Code family
    'code.exe', 'code - insiders.exe',
    // VS Code forks
    'cursor.exe',           // Cursor
    'windsurf.exe',         // Windsurf
    'positron.exe',         // Positron
    // JetBrains IDEs
    'idea64.exe', 'idea.exe',           // IntelliJ IDEA
    'webstorm64.exe', 'webstorm.exe',   // WebStorm
    'pycharm64.exe', 'pycharm.exe',     // PyCharm
    'phpstorm64.exe', 'phpstorm.exe',   // PhpStorm
    'goland64.exe', 'goland.exe',       // GoLand
    'rustrover64.exe', 'rustrover.exe', // RustRover
    'rider64.exe', 'rider.exe',         // Rider
    'clion64.exe', 'clion.exe',         // CLion
    'datagrip64.exe', 'datagrip.exe',   // DataGrip
    'fleet.exe',                        // Fleet
    // Other IDEs/Terminals
    'windowsterminal.exe',  // Windows Terminal
    'sublime_text.exe',     // Sublime Text
    'zed.exe',              // Zed
    'terminal.app'          // macOS Terminal
  ];
  return ideNames.includes(lowerName);
}

/**
 * Get the terminal PID by walking up the process tree
 * Finds the shell process whose parent is an IDE (like VS Code)
 *
 * @returns {number} Terminal PID or falls back to parent PID
 */
function getTerminalPid() {
  const parentPid = process.ppid;

  try {
    if (process.platform === 'win32') {
      // Walk up to find a shell whose parent is an IDE
      let currentPid = parentPid;
      let lastShellPid = null;

      for (let i = 0; i < 10; i++) {
        const { parentPid: nextPid, processName } = getProcessInfoWin32(currentPid);

        // Track shell processes
        if (isShellProcess(processName)) {
          lastShellPid = currentPid;
        }

        // If we hit an IDE and we have a shell, return that shell
        if (isIDEProcess(processName) && lastShellPid) {
          return lastShellPid;
        }

        if (!nextPid || nextPid <= 4) break;
        currentPid = nextPid;
      }

      // Fallback: return the last shell found or parent PID
      return lastShellPid || parentPid;
    } else {
      // Unix/Linux/macOS: Walk up via /proc to find shell
      let currentPid = parentPid;
      let lastShellPid = null;

      for (let i = 0; i < 10; i++) {
        const commPath = `/proc/${currentPid}/comm`;
        if (fs.existsSync(commPath)) {
          const comm = fs.readFileSync(commPath, 'utf8').trim();
          if (['bash', 'zsh', 'sh', 'fish', 'dash', 'ksh', 'tcsh', 'csh'].includes(comm)) {
            lastShellPid = currentPid;
          }
          // Check for IDE
          const ideCommNames = [
            'code', 'code-insiders', 'cursor', 'windsurf', 'positron', 'zed',
            'idea', 'webstorm', 'pycharm', 'phpstorm', 'goland', 'rustrover', 'rider', 'clion', 'datagrip', 'fleet',
            'sublime_text', 'gnome-terminal', 'konsole', 'xterm', 'alacritty', 'kitty', 'wezterm', 'iterm2'
          ];
          if (ideCommNames.includes(comm) && lastShellPid) {
            return lastShellPid;
          }
        }

        const statPath = `/proc/${currentPid}/stat`;
        if (!fs.existsSync(statPath)) break;

        const stat = fs.readFileSync(statPath, 'utf8');
        const match = stat.match(/^\d+\s+\([^)]+\)\s+\S+\s+(\d+)/);
        if (!match) break;

        const nextPid = parseInt(match[1], 10);
        if (nextPid <= 1) break;
        currentPid = nextPid;
      }

      return lastShellPid || parentPid;
    }
  } catch (e) {
    // Fall back to parent PID on error
  }

  return parentPid;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS & PATHS
// ═══════════════════════════════════════════════════════════════════════════

const GEMINI_DIR = path.resolve(__dirname, '..', '..');
const ENV_PATH = path.join(GEMINI_DIR, '.env');
const GEMKIT_HOME = path.join(os.homedir(), '.gemkit');
const PROJECTS_DIR = path.join(GEMKIT_HOME, 'projects');

// ═══════════════════════════════════════════════════════════════════════════
// ID GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate gkSessionId - consistent format for ALL clients
 * Always includes PID for process-level tracking
 *
 * @param {string} appName - Application identifier (e.g., 'gemini-main', 'vscode')
 * @param {number} pid - Process ID to embed in the session ID
 * @returns {string} Format: "{appName}-{PID}-{timestamp36}-{random4}"
 */
function generateGkSessionId(appName, pid) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${appName}-${pid}-${timestamp}-${random}`;
}

/**
 * Parse gkSessionId to extract components
 * @param {string} gkSessionId
 * @returns {{ appName: string, pid: number, timestamp: string, random: string } | null}
 */
function parseGkSessionId(gkSessionId) {
  if (!gkSessionId) return null;

  // Format: {appName}-{PID}-{ts36}-{rand4}
  // appName can contain hyphens (e.g., 'gemini-main'), so we match from the end
  const match = gkSessionId.match(/^(.+)-(\d+)-([a-z0-9]+)-([a-z0-9]{4})$/);
  if (!match) return null;

  return {
    appName: match[1],
    pid: parseInt(match[2], 10),
    timestamp: match[3],
    random: match[4]
  };
}

/**
 * Get PID from gkSessionId
 * @param {string} gkSessionId
 * @returns {number|null}
 */
function getPidFromSessionId(gkSessionId) {
  const parsed = parseGkSessionId(gkSessionId);
  return parsed ? parsed.pid : null;
}

/**
 * Detect session type from gkSessionId
 * @param {string} gkSessionId
 * @returns {'gemini'|'non-gemini'|null}
 */
function detectSessionType(gkSessionId) {
  const parsed = parseGkSessionId(gkSessionId);
  if (!parsed) return null;
  return parsed.appName.startsWith('gemini-') ? 'gemini' : 'non-gemini';
}

/**
 * Check if session is a Gemini session
 * @param {string} gkSessionId
 * @returns {boolean}
 */
function isGeminiSession(gkSessionId) {
  return detectSessionType(gkSessionId) === 'gemini';
}

/**
 * Check if session is a non-Gemini session
 * @param {string} gkSessionId
 * @returns {boolean}
 */
function isNonGeminiSession(gkSessionId) {
  return detectSessionType(gkSessionId) === 'non-gemini';
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT IDENTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitize path to create safe directory name
 * Replaces path separators and special chars with hyphens
 * @param {string} projectPath - Full path to project
 * @returns {string} Sanitized directory name
 */
function sanitizeProjectPath(projectPath) {
  if (!projectPath) return '';
  return projectPath
    .replace(/^[A-Za-z]:/, m => m.replace(':', '')) // C: -> C
    .replace(/[\\/]+/g, '-')  // path separators to hyphens
    .replace(/[^a-zA-Z0-9-]/g, '-')  // other special chars to hyphens
    .replace(/-+/g, '-')  // collapse multiple hyphens
    .replace(/^-|-$/g, '');  // trim leading/trailing hyphens
}

/**
 * Generate gkProjectHash from project directory path
 * @param {string} projectPath - Full path to project
 * @returns {string} 16-char hex hash
 */
function generateGkProjectHash(projectPath) {
  const normalizedPath = projectPath.replace(/\\/g, '/').toLowerCase();
  return crypto.createHash('sha256')
    .update(normalizedPath)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Generate all project identifiers from project path
 * @param {string} projectPath - Full path to project (defaults to cwd)
 * @returns {{ projectDir: string, gkProjectHash: string, projectPath: string }}
 */
function generateProjectIdentifiers(projectPath) {
  const cwd = projectPath || process.cwd();
  return {
    projectDir: sanitizeProjectPath(cwd),
    gkProjectHash: generateGkProjectHash(cwd),
    projectPath: cwd
  };
}

/**
 * Get projectDir from environment or generate from cwd
 * @returns {string}
 */
function getProjectDirFromEnv() {
  const env = readEnv();
  if (env.PROJECT_DIR) return env.PROJECT_DIR;
  return sanitizeProjectPath(process.cwd());
}

// ═══════════════════════════════════════════════════════════════════════════
// PATH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ensure directory exists (recursive)
 * @param {string} dirPath
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get path to project data directory
 * @param {string} projectDir - Sanitized project directory name
 * @returns {string}
 */
function getProjectDataDir(projectDir) {
  return path.join(PROJECTS_DIR, projectDir);
}

/**
 * Get path to session file
 * @param {string} projectDir - Sanitized project directory name
 * @param {string} gkSessionId
 * @returns {string}
 */
function getSessionPath(projectDir, gkSessionId) {
  return path.join(getProjectDataDir(projectDir), `gk-session-${gkSessionId}.json`);
}

/**
 * Get path to project file
 * @param {string} projectDir - Sanitized project directory name
 * @param {string} gkProjectHash
 * @returns {string}
 */
function getProjectPath(projectDir, gkProjectHash) {
  return path.join(getProjectDataDir(projectDir), `gk-project-${gkProjectHash}.json`);
}

// ═══════════════════════════════════════════════════════════════════════════
// ENV FILE MANAGEMENT (.gemini/.env)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Read environment variables from .gemini/.env
 * @returns {Object} Environment variables
 */
function readEnv() {
  const result = {
    // GemKit IDs
    ACTIVE_GK_SESSION_ID: '',
    GK_PROJECT_HASH: '',
    PROJECT_DIR: '',

    // Gemini IDs (mapped)
    ACTIVE_GEMINI_SESSION_ID: '',  // Current session's geminiSessionId (for sub-agent spawning)
    GEMINI_PROJECT_HASH: '',
    GEMINI_PARENT_ID: '',          // Parent's geminiSessionId (when this IS a sub-agent)

    // Plan info
    ACTIVE_PLAN: '',
    SUGGESTED_PLAN: '',
    PLAN_DATE_FORMAT: ''
  };

  if (!fs.existsSync(ENV_PATH)) {
    return result;
  }

  try {
    const content = fs.readFileSync(ENV_PATH, 'utf8');

    // GemKit IDs
    const gkSessionMatch = content.match(/^ACTIVE_GK_SESSION_ID=(.*)$/m);
    if (gkSessionMatch) result.ACTIVE_GK_SESSION_ID = gkSessionMatch[1].trim();

    const gkHashMatch = content.match(/^GK_PROJECT_HASH=(.*)$/m);
    if (gkHashMatch) result.GK_PROJECT_HASH = gkHashMatch[1].trim();

    const projectDirMatch = content.match(/^PROJECT_DIR=(.*)$/m);
    if (projectDirMatch) result.PROJECT_DIR = projectDirMatch[1].trim();

    // Gemini IDs
    const geminiSessionMatch = content.match(/^ACTIVE_GEMINI_SESSION_ID=(.*)$/m);
    if (geminiSessionMatch) result.ACTIVE_GEMINI_SESSION_ID = geminiSessionMatch[1].trim();

    const geminiHashMatch = content.match(/^GEMINI_PROJECT_HASH=(.*)$/m);
    if (geminiHashMatch) result.GEMINI_PROJECT_HASH = geminiHashMatch[1].trim();

    const geminiParentMatch = content.match(/^GEMINI_PARENT_ID=(.*)$/m);
    if (geminiParentMatch) result.GEMINI_PARENT_ID = geminiParentMatch[1].trim();

    // Plan info
    const activePlanMatch = content.match(/^ACTIVE_PLAN=(.*)$/m);
    if (activePlanMatch) result.ACTIVE_PLAN = activePlanMatch[1].trim();

    const suggestedPlanMatch = content.match(/^SUGGESTED_PLAN=(.*)$/m);
    if (suggestedPlanMatch) result.SUGGESTED_PLAN = suggestedPlanMatch[1].trim();

    const dateFormatMatch = content.match(/^PLAN_DATE_FORMAT=(.*)$/m);
    if (dateFormatMatch) result.PLAN_DATE_FORMAT = dateFormatMatch[1].trim();

    // Legacy support: map old variable names
    const legacySessionMatch = content.match(/^ACTIVE_GEMINI_SESSION_ID=(.*)$/m);
    if (legacySessionMatch && !result.ACTIVE_GK_SESSION_ID) {
      result.ACTIVE_GK_SESSION_ID = legacySessionMatch[1].trim();
    }
  } catch (e) {
    // Return empty values on error
  }

  return result;
}

/**
 * Update .gemini/.env with session and project info
 * @param {Object} envData
 * @returns {boolean}
 */
function updateEnv(envData) {
  try {
    const content = [
      '# Auto-generated by gk-session-manager',
      `# Updated at: ${new Date().toISOString()}`,
      '',
      '# GEMKIT IDs',
      `ACTIVE_GK_SESSION_ID=${envData.gkSessionId || ''}`,
      `GK_PROJECT_HASH=${envData.gkProjectHash || ''}`,
      `PROJECT_DIR=${envData.projectDir || ''}`,
      '',
      '# GEMINI IDs (mapped)',
      `ACTIVE_GEMINI_SESSION_ID=${envData.geminiSessionId || ''}`,
      `GEMINI_PROJECT_HASH=${envData.geminiProjectHash || ''}`,
      '',
      '# PLAN INFO',
      `ACTIVE_PLAN=${envData.activePlan || ''}`,
      `SUGGESTED_PLAN=${envData.suggestedPlan || ''}`,
      `PLAN_DATE_FORMAT=${envData.planDateFormat || ''}`,
      ''
    ].join('\n');

    fs.writeFileSync(ENV_PATH, content, 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get active gkSessionId from .env
 * @returns {string|null}
 */
function getActiveGkSessionId() {
  const env = readEnv();
  return env.ACTIVE_GK_SESSION_ID || null;
}

/**
 * Get gkProjectHash from .env
 * @returns {string|null}
 */
function getGkProjectHash() {
  const env = readEnv();
  return env.GK_PROJECT_HASH || null;
}

/**
 * Get active geminiSessionId from .env
 * @returns {string|null}
 */
function getActiveGeminiSessionId() {
  const env = readEnv();
  return env.ACTIVE_GEMINI_SESSION_ID || null;
}

/**
 * Get geminiProjectHash from .env
 * @returns {string|null}
 */
function getGeminiProjectHash() {
  const env = readEnv();
  return env.GEMINI_PROJECT_HASH || null;
}

/**
 * Get active plan from .env
 * @returns {string|null}
 */
function getActivePlan() {
  const env = readEnv();
  return env.ACTIVE_PLAN || null;
}

/**
 * Get suggested plan from .env
 * @returns {string|null}
 */
function getSuggestedPlan() {
  const env = readEnv();
  return env.SUGGESTED_PLAN || null;
}

/**
 * Get plan date format from .env
 * @returns {string|null}
 */
function getPlanDateFormat() {
  const env = readEnv();
  return env.PLAN_DATE_FORMAT || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Read session from file
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @returns {Object|null}
 */
function getSession(projectDir, gkSessionId) {
  if (!projectDir || !gkSessionId) return null;

  const sessionPath = getSessionPath(projectDir, gkSessionId);
  if (!fs.existsSync(sessionPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

/**
 * Reorder session object to put agents array at the end
 * @param {Object} session
 * @returns {Object}
 */
function reorderSessionFields(session) {
  const { agents, ...rest } = session;
  return {
    ...rest,
    agents: agents || []
  };
}

/**
 * Save session to file (atomic write)
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {Object} data
 * @returns {boolean}
 */
function saveSession(projectDir, gkSessionId, data) {
  if (!projectDir || !gkSessionId) return false;

  const projectDataDir = getProjectDataDir(projectDir);
  ensureDir(projectDataDir);

  const sessionPath = getSessionPath(projectDir, gkSessionId);
  const tempPath = `${sessionPath}.tmp`;

  try {
    const orderedData = reorderSessionFields(data);
    fs.writeFileSync(tempPath, JSON.stringify(orderedData, null, 2), 'utf8');
    fs.renameSync(tempPath, sessionPath);
    return true;
  } catch (e) {
    try { fs.unlinkSync(tempPath); } catch (_) {}
    return false;
  }
}

/**
 * Update specific fields in session
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {Object} updates
 * @returns {Object|null}
 */
function updateSession(projectDir, gkSessionId, updates) {
  const session = getSession(projectDir, gkSessionId);
  if (!session) return null;

  const updated = { ...session, ...updates };
  if (saveSession(projectDir, gkSessionId, updated)) {
    return updated;
  }
  return null;
}

/**
 * Check if session exists
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @returns {boolean}
 */
function sessionExists(projectDir, gkSessionId) {
  if (!projectDir || !gkSessionId) return false;
  return fs.existsSync(getSessionPath(projectDir, gkSessionId));
}

// ═══════════════════════════════════════════════════════════════════════════
// AGENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Add agent to session (or update if already exists)
 * @param {string} projectDir
 * @param {string} gkSessionId - Parent session ID
 * @param {Object} agentData
 * @returns {boolean}
 */
function addAgent(projectDir, gkSessionId, agentData) {
  const session = getSession(projectDir, gkSessionId);
  if (!session) return false;

  const agentGkSessionId = agentData.gkSessionId || gkSessionId;
  session.agents = session.agents || [];

  const existingIndex = session.agents.findIndex(a => a.gkSessionId === agentGkSessionId);

  if (existingIndex >= 0) {
    const existing = session.agents[existingIndex];
    session.agents[existingIndex] = {
      ...existing,
      model: existing.model || agentData.model || null,
      prompt: existing.prompt || agentData.prompt || null
    };
  } else {
    const agent = {
      gkSessionId: agentGkSessionId,
      pid: agentData.pid || getPidFromSessionId(agentGkSessionId),
      geminiSessionId: agentData.geminiSessionId || null,
      geminiProjectHash: agentData.geminiProjectHash || null,  // For activity monitoring
      parentGkSessionId: agentData.parentGkSessionId || null,
      agentType: agentData.parentGkSessionId ? 'Sub Agent' : 'Main Agent',
      agentRole: agentData.agentRole || 'main',
      prompt: agentData.prompt || null,
      model: agentData.model || null,
      tokenUsage: agentData.tokenUsage || null,  // For routing decisions
      retryCount: agentData.retryCount || 0,     // Retry attempts on THIS agent (unresponsive recovery)
      resumeCount: agentData.resumeCount || 0,   // Number of times agent was resumed via routing
      generation: agentData.generation || 0,     // Which replacement number (0 = original)
      injected: agentData.injected || null,  // Track injected skills/context to avoid duplication
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'active',
      exitCode: null,
      error: null
    };
    session.agents.push(agent);
  }

  return saveSession(projectDir, gkSessionId, session);
}

/**
 * Update agent in session
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {string} agentGkSessionId
 * @param {Object} updates
 * @returns {boolean}
 */
function updateAgent(projectDir, gkSessionId, agentGkSessionId, updates) {
  const session = getSession(projectDir, gkSessionId);
  if (!session || !session.agents) return false;

  const agentIndex = session.agents.findIndex(a => a.gkSessionId === agentGkSessionId);
  if (agentIndex === -1) return false;

  session.agents[agentIndex] = {
    ...session.agents[agentIndex],
    ...updates
  };

  return saveSession(projectDir, gkSessionId, session);
}

/**
 * Update agent's geminiSessionId (for pre-generated agents)
 * Used when spawn command creates agent first, then hook updates with actual geminiSessionId
 * @param {string} projectDir
 * @param {string} gkSessionId - Parent session ID
 * @param {string} agentGkSessionId - Agent's GK session ID (pre-generated)
 * @param {string} geminiSessionId - Gemini's actual session ID
 * @returns {boolean}
 */
function updateAgentGeminiSession(projectDir, gkSessionId, agentGkSessionId, geminiSessionId) {
  const session = getSession(projectDir, gkSessionId);
  if (!session || !session.agents) return false;

  const agent = session.agents.find(a => a.gkSessionId === agentGkSessionId);
  if (!agent) return false;

  // Update the geminiSessionId
  agent.geminiSessionId = geminiSessionId;

  return saveSession(projectDir, gkSessionId, session);
}

/**
 * End agent session
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {string} agentGkSessionId
 * @param {Object} result - { status, exitCode, error }
 * @returns {boolean}
 */
function endAgent(projectDir, gkSessionId, agentGkSessionId, result) {
  const updates = {
    endTime: new Date().toISOString(),
    status: result.status || 'completed',
    exitCode: result.exitCode ?? 0,
    error: result.error || null
  };

  // Include tokenUsage if provided
  if (result.tokenUsage) {
    updates.tokenUsage = result.tokenUsage;
  }

  return updateAgent(projectDir, gkSessionId, agentGkSessionId, updates);
}

/**
 * Update agent prompt (only if not already set)
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {string} agentGkSessionId
 * @param {string} prompt
 * @returns {boolean}
 */
function updateAgentPrompt(projectDir, gkSessionId, agentGkSessionId, prompt) {
  const session = getSession(projectDir, gkSessionId);
  if (!session || !session.agents) return false;

  const agent = session.agents.find(a => a.gkSessionId === agentGkSessionId);
  if (!agent || agent.prompt) return false;

  return updateAgent(projectDir, gkSessionId, agentGkSessionId, { prompt });
}

/**
 * Get all agents in session
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {Object} filters
 * @returns {Array}
 */
function getAgents(projectDir, gkSessionId, filters = {}) {
  const session = getSession(projectDir, gkSessionId);
  if (!session || !session.agents) return [];

  let agents = session.agents;

  if (filters.agentType) {
    agents = agents.filter(a => a.agentType === filters.agentType);
  }
  if (filters.status) {
    agents = agents.filter(a => a.status === filters.status);
  }

  return agents;
}

/**
 * Get metrics for session
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @returns {Object}
 */
function getMetrics(projectDir, gkSessionId) {
  const agents = getAgents(projectDir, gkSessionId);

  const metrics = {
    total: agents.length,
    active: 0,
    completed: 0,
    failed: 0,
    mainAgents: 0,
    subAgents: 0,
    totalDurationMs: 0
  };

  agents.forEach(agent => {
    if (agent.status === 'active') metrics.active++;
    else if (agent.status === 'completed') metrics.completed++;
    else if (agent.status === 'failed') metrics.failed++;

    if (agent.agentType === 'Main Agent') metrics.mainAgents++;
    else metrics.subAgents++;

    if (agent.startTime && agent.endTime) {
      metrics.totalDurationMs += new Date(agent.endTime) - new Date(agent.startTime);
    }
  });

  return metrics;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get project data
 * @param {string} projectDir
 * @param {string} gkProjectHash
 * @returns {Object|null}
 */
function getProject(projectDir, gkProjectHash) {
  if (!projectDir || !gkProjectHash) return null;

  const projectPath = getProjectPath(projectDir, gkProjectHash);
  if (!fs.existsSync(projectPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(projectPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

/**
 * Save project data
 * @param {string} projectDir
 * @param {string} gkProjectHash
 * @param {Object} data
 * @returns {boolean}
 */
function saveProject(projectDir, gkProjectHash, data) {
  if (!projectDir || !gkProjectHash) return false;

  const projectDataDir = getProjectDataDir(projectDir);
  ensureDir(projectDataDir);

  const projectPath = getProjectPath(projectDir, gkProjectHash);

  try {
    fs.writeFileSync(projectPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Create or get project
 * @param {string} projectDir
 * @param {string} gkProjectHash
 * @param {string} projectPath - Full project path
 * @returns {Object}
 */
function ensureProject(projectDir, gkProjectHash, projectPath) {
  let project = getProject(projectDir, gkProjectHash);

  if (!project) {
    project = {
      gkProjectHash: gkProjectHash,
      projectDir: projectDir,
      projectPath: projectPath || process.cwd(),
      geminiProjectHash: null,

      initialized: true,
      initTimestamp: new Date().toISOString(),
      lastActiveTimestamp: new Date().toISOString(),
      activeGkSessionId: null,

      sessions: []
    };
    saveProject(projectDir, gkProjectHash, project);
  }

  return project;
}

/**
 * Add session summary to project
 * @param {string} projectDir
 * @param {string} gkProjectHash
 * @param {Object} sessionSummary
 * @returns {boolean}
 */
function addSessionToProject(projectDir, gkProjectHash, sessionSummary) {
  const project = ensureProject(projectDir, gkProjectHash);

  project.activeGkSessionId = sessionSummary.gkSessionId;
  project.lastActiveTimestamp = new Date().toISOString();

  const existingIndex = project.sessions.findIndex(s => s.gkSessionId === sessionSummary.gkSessionId);
  if (existingIndex >= 0) {
    const existing = project.sessions[existingIndex];
    project.sessions[existingIndex] = {
      gkSessionId: sessionSummary.gkSessionId,
      pid: sessionSummary.pid || existing.pid,
      sessionType: sessionSummary.sessionType || existing.sessionType,
      appName: sessionSummary.appName || existing.appName,
      prompt: sessionSummary.prompt || existing.prompt || null,
      activePlan: sessionSummary.activePlan || existing.activePlan || null,
      startTime: sessionSummary.startTime || existing.startTime,
      endTime: sessionSummary.endTime || existing.endTime || null
    };
  } else {
    project.sessions.push({
      gkSessionId: sessionSummary.gkSessionId,
      pid: sessionSummary.pid || null,
      sessionType: sessionSummary.sessionType || 'gemini',
      appName: sessionSummary.appName || 'gemini-main',
      prompt: sessionSummary.prompt || null,
      activePlan: sessionSummary.activePlan || null,
      startTime: sessionSummary.startTime || new Date().toISOString(),
      endTime: sessionSummary.endTime || null
    });
  }

  // Sort sessions by startTime descending
  project.sessions.sort((a, b) => {
    const timeA = new Date(a.startTime || 0).getTime();
    const timeB = new Date(b.startTime || 0).getTime();
    return timeB - timeA;
  });

  return saveProject(projectDir, gkProjectHash, project);
}

/**
 * Get all sessions for a project
 * @param {string} projectDir
 * @param {string} gkProjectHash
 * @returns {Array}
 */
function getProjectSessions(projectDir, gkProjectHash) {
  const project = getProject(projectDir, gkProjectHash);
  return project?.sessions || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// HIGH-LEVEL SESSION INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialize a Gemini CLI session
 * Creates gkSessionId and maps to Gemini's sessionId
 *
 * @param {string} geminiSessionId - Gemini CLI's UUID session ID
 * @param {string|null} geminiParentId - Gemini CLI's parent session ID (for sub-agents)
 * @param {Object} options - Additional session options
 * @returns {{ session: Object, gkSessionId: string, pid: number, projectDir: string, gkProjectHash: string, isResume: boolean }}
 */
function initializeGeminiSession(geminiSessionId, geminiParentId, options = {}) {
  const { projectDir, gkProjectHash, projectPath } = generateProjectIdentifiers(options.cwd);
  const pid = process.pid;

  // Determine app name based on parent
  const appName = geminiParentId ? 'gemini-sub' : 'gemini-main';
  const gkSessionId = generateGkSessionId(appName, pid);

  // Check for existing session (resume case - by geminiSessionId)
  const existingSessionPath = findSessionByGeminiId(projectDir, geminiSessionId);
  if (existingSessionPath) {
    const existingSession = JSON.parse(fs.readFileSync(existingSessionPath, 'utf8'));
    const existingGkSessionId = existingSession.gkSessionId;

    // Update env - preserve existing geminiProjectHash if session doesn't have one
    // This handles native sub-agents whose sessions don't have the hash
    const currentEnv = readEnv();
    updateEnv({
      gkSessionId: existingGkSessionId,
      gkProjectHash: existingSession.gkProjectHash || gkProjectHash,
      projectDir: projectDir,
      geminiSessionId: geminiSessionId,  // Store for sub-agent spawning
      geminiProjectHash: existingSession.geminiProjectHash || currentEnv.GEMINI_PROJECT_HASH || '',
      activePlan: existingSession.activePlan || '',
      suggestedPlan: existingSession.suggestedPlan || '',
      planDateFormat: existingSession.planDateFormat || ''
    });

    return {
      session: existingSession,
      gkSessionId: existingGkSessionId,
      pid: existingSession.pid,
      projectDir: projectDir,
      gkProjectHash: existingSession.gkProjectHash || gkProjectHash,
      isResume: true
    };
  }

  // Double-check: ensure no session with this geminiSessionId exists (race condition protection)
  // This handles edge cases where multiple hooks might run simultaneously
  const doubleCheck = findSessionByGeminiId(projectDir, geminiSessionId);
  if (doubleCheck) {
    // Session was created by another process, use that one
    const existingSession = JSON.parse(fs.readFileSync(doubleCheck, 'utf8'));
    const existingGkSessionId = existingSession.gkSessionId;

    // Update env to reflect this session
    const currentEnv = readEnv();
    updateEnv({
      gkSessionId: existingGkSessionId,
      gkProjectHash: existingSession.gkProjectHash || gkProjectHash,
      projectDir: projectDir,
      geminiSessionId: geminiSessionId,
      geminiProjectHash: existingSession.geminiProjectHash || currentEnv.GEMINI_PROJECT_HASH || '',
      activePlan: existingSession.activePlan || '',
      suggestedPlan: existingSession.suggestedPlan || '',
      planDateFormat: existingSession.planDateFormat || ''
    });

    return {
      session: existingSession,
      gkSessionId: existingGkSessionId,
      pid: existingSession.pid,
      projectDir: projectDir,
      gkProjectHash: existingSession.gkProjectHash || gkProjectHash,
      isResume: true
    };
  }

  // Create new session
  const session = {
    // GemKit identification
    gkSessionId: gkSessionId,
    gkProjectHash: gkProjectHash,
    projectDir: projectDir,

    // Gemini mapping
    geminiSessionId: geminiSessionId,
    geminiParentId: geminiParentId,
    geminiProjectHash: null,

    // Session metadata
    initialized: true,
    initTimestamp: new Date().toISOString(),
    sessionType: 'gemini',
    appName: appName,
    pid: pid,

    // Plan management
    activePlan: options.activePlan || null,
    suggestedPlan: options.suggestedPlan || null,
    planDateFormat: options.planDateFormat || '',

    // Additional state from options
    ...options.initialState,

    // Agents array (always last)
    agents: []
  };

  // Save session
  ensureDir(getProjectDataDir(projectDir));
  saveSession(projectDir, gkSessionId, session);

  // Update project
  ensureProject(projectDir, gkProjectHash, projectPath);
  addSessionToProject(projectDir, gkProjectHash, {
    gkSessionId: gkSessionId,
    pid: pid,
    sessionType: 'gemini',
    appName: appName,
    startTime: session.initTimestamp,
    activePlan: session.activePlan
  });

  // Update env - preserve existing geminiProjectHash if already captured
  // This handles native Gemini sub-agents that create "new sessions" but shouldn't clear the hash
  const existingEnv = readEnv();
  updateEnv({
    gkSessionId: gkSessionId,
    gkProjectHash: gkProjectHash,
    projectDir: projectDir,
    geminiSessionId: geminiSessionId,  // Store for sub-agent spawning
    geminiProjectHash: existingEnv.GEMINI_PROJECT_HASH || '',  // Preserve existing
    activePlan: session.activePlan || '',
    suggestedPlan: session.suggestedPlan || '',
    planDateFormat: session.planDateFormat || ''
  });

  return {
    session: session,
    gkSessionId: gkSessionId,
    pid: pid,
    projectDir: projectDir,
    gkProjectHash: gkProjectHash,
    isResume: false
  };
}

/**
 * Initialize a non-Gemini session (for VS Code, scripts, etc.)
 * Uses process.ppid to capture the parent process (calling shell/terminal)
 *
 * @param {string} appName - Application identifier
 * @param {Object} options - Additional session options
 * @returns {{ session: Object, gkSessionId: string, pid: number, projectDir: string, gkProjectHash: string }}
 */
function initializeNonGeminiSession(appName, options = {}) {
  const { projectDir, gkProjectHash, projectPath } = generateProjectIdentifiers(options.cwd);
  // Use terminal PID (grandparent) for non-Gemini sessions
  // Process hierarchy: Terminal -> Shell -> Node.js script
  const pid = getTerminalPid();
  const gkSessionId = generateGkSessionId(appName, pid);

  const session = {
    // GemKit identification
    gkSessionId: gkSessionId,
    gkProjectHash: gkProjectHash,
    projectDir: projectDir,

    // No Gemini mapping for non-Gemini sessions
    geminiSessionId: null,
    geminiParentId: null,
    geminiProjectHash: null,

    // Session metadata
    initialized: true,
    initTimestamp: new Date().toISOString(),
    sessionType: 'non-gemini',
    appName: appName,
    pid: pid,

    // Plan management
    activePlan: options.activePlan || null,
    suggestedPlan: options.suggestedPlan || null,

    // Additional state
    ...options.initialState,

    // Agents array
    agents: []
  };

  // Save session
  ensureDir(getProjectDataDir(projectDir));
  saveSession(projectDir, gkSessionId, session);

  // Update project
  ensureProject(projectDir, gkProjectHash, projectPath);
  addSessionToProject(projectDir, gkProjectHash, {
    gkSessionId: gkSessionId,
    pid: pid,
    sessionType: 'non-gemini',
    appName: appName,
    startTime: session.initTimestamp,
    activePlan: session.activePlan
  });

  // Update env - CLEAR Gemini session ID for non-Gemini apps
  // This ensures sub-agents use GK_PARENT_SESSION_ID, not stale GEMINI_PARENT_SESSION_ID
  const existingEnv = readEnv();

  // Only preserve geminiProjectHash if we're in the SAME project
  // Don't carry over hash from a different project folder
  const isSameProject = existingEnv.PROJECT_DIR === projectDir;
  const preservedGeminiProjectHash = isSameProject ? (existingEnv.GEMINI_PROJECT_HASH || '') : '';

  updateEnv({
    gkSessionId: gkSessionId,
    gkProjectHash: gkProjectHash,
    projectDir: projectDir,
    geminiSessionId: '',  // Clear - no Gemini session for non-Gemini apps
    geminiProjectHash: preservedGeminiProjectHash,
    activePlan: session.activePlan || '',
    suggestedPlan: session.suggestedPlan || '',
    planDateFormat: ''
  });

  return {
    session: session,
    gkSessionId: gkSessionId,
    pid: pid,
    projectDir: projectDir,
    gkProjectHash: gkProjectHash
  };
}

/**
 * Find session file by Gemini session ID
 * @param {string} projectDir
 * @param {string} geminiSessionId
 * @returns {string|null} Path to session file or null
 */
function findSessionByGeminiId(projectDir, geminiSessionId) {
  if (!projectDir || !geminiSessionId) return null;

  const projectDataDir = getProjectDataDir(projectDir);
  if (!fs.existsSync(projectDataDir)) return null;

  try {
    const files = fs.readdirSync(projectDataDir);
    for (const file of files) {
      if (!file.startsWith('gk-session-') || !file.endsWith('.json')) continue;

      const filePath = path.join(projectDataDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const session = JSON.parse(content);

      if (session.geminiSessionId === geminiSessionId) {
        return filePath;
      }
    }
  } catch (e) {
    // Ignore errors
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT HASH CAPTURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Capture Gemini's project hash from BeforeModel hook
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {string} geminiProjectHash - 64-char hash from Gemini
 * @param {string} geminiTempDir - Project temp directory from Gemini
 * @returns {boolean}
 */
function captureGeminiProjectHash(projectDir, gkSessionId, geminiProjectHash, geminiTempDir) {
  const session = getSession(projectDir, gkSessionId);
  if (!session) return false;

  // Skip if already captured
  if (session.geminiProjectHash && session.geminiTempDir) {
    return true;
  }

  // Update session
  const updates = {};
  if (!session.geminiProjectHash && geminiProjectHash) {
    updates.geminiProjectHash = geminiProjectHash;
  }
  if (!session.geminiTempDir && geminiTempDir) {
    updates.geminiTempDir = geminiTempDir;
  }
  if (!session.geminiProjectHashCapturedAt) {
    updates.geminiProjectHashCapturedAt = new Date().toISOString();
  }

  if (Object.keys(updates).length === 0) return true;

  const updated = updateSession(projectDir, gkSessionId, updates);
  if (!updated) return false;

  // Update project with Gemini hash
  const project = getProject(projectDir, session.gkProjectHash);
  if (project && !project.geminiProjectHash) {
    project.geminiProjectHash = geminiProjectHash;
    saveProject(projectDir, session.gkProjectHash, project);
  }

  // Update env - use session data as source of truth, not env file
  // This prevents race conditions where env file might be stale/empty
  const env = readEnv();
  updateEnv({
    gkSessionId: session.gkSessionId || env.ACTIVE_GK_SESSION_ID || gkSessionId,
    gkProjectHash: session.gkProjectHash || env.GK_PROJECT_HASH,
    projectDir: session.projectDir || env.PROJECT_DIR,
    geminiSessionId: session.geminiSessionId || env.ACTIVE_GEMINI_SESSION_ID,  // Use session data first!
    geminiProjectHash: geminiProjectHash || session.geminiProjectHash || env.GEMINI_PROJECT_HASH,
    activePlan: session.activePlan || env.ACTIVE_PLAN,
    suggestedPlan: session.suggestedPlan || env.SUGGESTED_PLAN,
    planDateFormat: session.planDateFormat || env.PLAN_DATE_FORMAT
  });

  return true;
}

/**
 * Backfill project hash from child to parent session
 * Used when sub-agent captures projectHash before parent
 * @param {string} projectDir
 * @param {string} childGkSessionId
 * @param {string} parentGkSessionId
 * @returns {boolean}
 */
function backfillProjectHash(projectDir, childGkSessionId, parentGkSessionId) {
  const childSession = getSession(projectDir, childGkSessionId);
  const parentSession = getSession(projectDir, parentGkSessionId);

  if (!childSession || !parentSession) return false;
  if (!childSession.geminiProjectHash) return false;
  if (parentSession.geminiProjectHash) return true;  // Already has it

  return updateSession(projectDir, parentGkSessionId, {
    geminiProjectHash: childSession.geminiProjectHash,
    geminiTempDir: childSession.geminiTempDir
  }) !== null;
}

/**
 * Capture geminiProjectHash for a sub-agent and backfill to parent session
 * Called when sub-agent's BeforeModel hook captures the hash
 *
 * @param {string} projectDir
 * @param {string} parentGkSessionId - Parent session ID
 * @param {string} geminiSessionId - Sub-agent's Gemini session ID
 * @param {string} geminiProjectHash - 64-char hash from Gemini
 * @returns {boolean}
 */
function captureAgentProjectHash(projectDir, parentGkSessionId, geminiSessionId, geminiProjectHash) {
  if (!projectDir || !parentGkSessionId || !geminiSessionId || !geminiProjectHash) {
    return false;
  }

  const session = getSession(projectDir, parentGkSessionId);
  if (!session || !session.agents) return false;

  let updated = false;

  // Find agent by geminiSessionId and update geminiProjectHash
  const agentIndex = session.agents.findIndex(a => a.geminiSessionId === geminiSessionId);
  if (agentIndex >= 0 && !session.agents[agentIndex].geminiProjectHash) {
    session.agents[agentIndex].geminiProjectHash = geminiProjectHash;
    updated = true;
  }

  // Backfill to parent session if missing
  if (!session.geminiProjectHash) {
    session.geminiProjectHash = geminiProjectHash;
    updated = true;
  }

  if (!updated) return true;  // Nothing to update

  // Save session
  const saved = saveSession(projectDir, parentGkSessionId, session);

  // Update .env if GEMINI_PROJECT_HASH is empty
  if (saved) {
    const env = readEnv();
    if (!env.GEMINI_PROJECT_HASH) {
      updateEnv({
        gkSessionId: env.ACTIVE_GK_SESSION_ID,
        gkProjectHash: env.GK_PROJECT_HASH,
        projectDir: env.PROJECT_DIR,
        geminiSessionId: env.ACTIVE_GEMINI_SESSION_ID,
        geminiProjectHash: geminiProjectHash,
        activePlan: env.ACTIVE_PLAN,
        suggestedPlan: env.SUGGESTED_PLAN,
        planDateFormat: env.PLAN_DATE_FORMAT
      });
    }
  }

  return saved;
}

/**
 * Update agent token usage
 * @param {string} projectDir
 * @param {string} gkSessionId - Parent session
 * @param {string} agentGkSessionId - Agent to update
 * @param {Object} tokenUsage - { input, output, total }
 * @returns {boolean}
 */
function updateAgentTokens(projectDir, gkSessionId, agentGkSessionId, tokenUsage) {
  return updateAgent(projectDir, gkSessionId, agentGkSessionId, {
    tokenUsage: tokenUsage
  });
}

/**
 * Update agent injected context (skills, context files)
 * Used to track what was injected to avoid duplication on resume
 *
 * @param {string} projectDir
 * @param {string} gkSessionId - Parent session
 * @param {string} agentGkSessionId - Agent to update
 * @param {Object} injected - { skills: string[], context: string[], contextHash: string }
 * @returns {boolean}
 */
function updateAgentInjected(projectDir, gkSessionId, agentGkSessionId, injected) {
  return updateAgent(projectDir, gkSessionId, agentGkSessionId, {
    injected: injected
  });
}

/**
 * Increment agent's retryCount when retrying after unresponsive
 * @param {string} projectDir
 * @param {string} gkSessionId - Parent session ID
 * @param {string} agentGkSessionId - Agent's session ID
 * @returns {number} New retryCount value, or -1 if failed
 */
function incrementRetryCount(projectDir, gkSessionId, agentGkSessionId) {
  const session = getSession(projectDir, gkSessionId);
  if (!session || !session.agents) return -1;

  const agent = session.agents.find(a => a.gkSessionId === agentGkSessionId);
  if (!agent) return -1;

  const newCount = (agent.retryCount || 0) + 1;
  const updated = updateAgent(projectDir, gkSessionId, agentGkSessionId, {
    retryCount: newCount
  });

  return updated ? newCount : -1;
}

/**
 * Increment agent's resumeCount when resumed via routing
 * @param {string} projectDir
 * @param {string} gkSessionId - Parent session ID
 * @param {string} agentGkSessionId - Agent's session ID
 * @returns {number} New resumeCount value, or -1 if failed
 */
function incrementResumeCount(projectDir, gkSessionId, agentGkSessionId) {
  const session = getSession(projectDir, gkSessionId);
  if (!session || !session.agents) return -1;

  const agent = session.agents.find(a => a.gkSessionId === agentGkSessionId);
  if (!agent) return -1;

  const newCount = (agent.resumeCount || 0) + 1;
  const updated = updateAgent(projectDir, gkSessionId, agentGkSessionId, {
    resumeCount: newCount
  });

  return updated ? newCount : -1;
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION END & PLAN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * End session and update all tracking
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {Object} result - { status, exitCode, error }
 * @returns {boolean}
 */
function endSession(projectDir, gkSessionId, result) {
  const session = getSession(projectDir, gkSessionId);
  if (!session) return false;

  // End main agent
  const mainAgent = session.agents?.find(a => a.agentType === 'Main Agent' && a.gkSessionId === gkSessionId);
  if (mainAgent) {
    endAgent(projectDir, gkSessionId, gkSessionId, result);
  }

  // Re-read session
  const updatedSession = getSession(projectDir, gkSessionId);
  const updatedMainAgent = updatedSession?.agents?.find(a => a.agentType === 'Main Agent' && a.gkSessionId === gkSessionId);

  // Update project
  const gkProjectHash = updatedSession?.gkProjectHash || session.gkProjectHash;
  if (gkProjectHash) {
    addSessionToProject(projectDir, gkProjectHash, {
      gkSessionId: gkSessionId,
      prompt: updatedMainAgent?.prompt || mainAgent?.prompt || null,
      activePlan: updatedSession?.activePlan || session.activePlan,
      startTime: updatedSession?.initTimestamp || session.initTimestamp,
      endTime: new Date().toISOString()
    });
  }

  return true;
}

/**
 * Set active plan in session and .env
 * @param {string} projectDir
 * @param {string} gkSessionId
 * @param {string} planPath
 * @returns {boolean}
 */
function setActivePlan(projectDir, gkSessionId, planPath) {
  const session = getSession(projectDir, gkSessionId);
  if (!session) return false;

  // Update session
  session.activePlan = planPath;
  session.suggestedPlan = null;
  if (!saveSession(projectDir, gkSessionId, session)) {
    return false;
  }

  // Update env - preserve existing values
  const env = readEnv();
  return updateEnv({
    gkSessionId: gkSessionId,
    gkProjectHash: session.gkProjectHash || env.GK_PROJECT_HASH,
    projectDir: projectDir,
    geminiSessionId: session.geminiSessionId || env.ACTIVE_GEMINI_SESSION_ID,  // Preserve
    geminiProjectHash: session.geminiProjectHash || env.GEMINI_PROJECT_HASH,
    activePlan: planPath,
    suggestedPlan: '',
    planDateFormat: session.planDateFormat || env.PLAN_DATE_FORMAT
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// LEGACY COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get active session ID (legacy - returns gkSessionId)
 * @returns {string|null}
 */
function getActiveSessionId() {
  return getActiveGkSessionId();
}

/**
 * Get active project hash (legacy - returns gkProjectHash)
 * @returns {string|null}
 */
function getActiveProjectHash() {
  return getGkProjectHash();
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  // Constants
  GEMINI_DIR,
  ENV_PATH,
  GEMKIT_HOME,
  PROJECTS_DIR,

  // ID Generation
  generateGkSessionId,
  parseGkSessionId,
  getPidFromSessionId,
  detectSessionType,
  isGeminiSession,
  isNonGeminiSession,

  // Project Identification
  sanitizeProjectPath,
  generateGkProjectHash,
  generateProjectIdentifiers,
  getProjectDirFromEnv,

  // Path Utilities
  ensureDir,
  getProjectDataDir,
  getSessionPath,
  getProjectPath,

  // Env File
  readEnv,
  updateEnv,
  getActiveGkSessionId,
  getActiveGeminiSessionId,
  getGkProjectHash,
  getGeminiProjectHash,
  getActivePlan,
  getSuggestedPlan,
  getPlanDateFormat,

  // Session Management
  getSession,
  saveSession,
  updateSession,
  sessionExists,

  // Agent Management
  addAgent,
  updateAgent,
  updateAgentGeminiSession,
  endAgent,
  updateAgentPrompt,
  getAgents,
  getMetrics,
  incrementResumeCount,

  // Project Management
  getProject,
  saveProject,
  ensureProject,
  addSessionToProject,
  getProjectSessions,

  // High-Level Operations
  initializeGeminiSession,
  initializeNonGeminiSession,
  findSessionByGeminiId,
  captureGeminiProjectHash,
  captureAgentProjectHash,
  backfillProjectHash,
  updateAgentTokens,
  updateAgentInjected,
  incrementRetryCount,
  endSession,
  setActivePlan,

  // Legacy Compatibility
  getActiveSessionId,
  getActiveProjectHash,

  // Process Utilities
  getTerminalPid
};