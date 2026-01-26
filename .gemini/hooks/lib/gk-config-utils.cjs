/**
 * GK Config Utils - Shared utilities for Gemini-kit hooks
 *
 * GEMINI-KIT ADAPTATION:
 * - No writeEnv() since Gemini CLI doesn't provide GEMINI_ENV_FILE
 * - State stored in ~/.gemkit/projects/{projectDir}/ (NOT os.tmpdir())
 *
 * Contains config loading, path sanitization, and common constants
 * used by gk-session-init.cjs and other hooks
 *
 * NOTE: Session state functions now delegate to gk-session-manager.cjs
 * which stores files in ~/.gemkit/projects/{projectDir}/
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Import session manager for session state operations
const sessionManager = require('./gk-session-manager.cjs');

// === PATHS (Updated for Gemini-kit) ===
const LOCAL_CONFIG_PATH = '.gemini/.gk.json';
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), '.gemini', '.gk.json');

// Legacy export for backward compatibility
const CONFIG_PATH = LOCAL_CONFIG_PATH;

// === DEFAULT CONFIG ===
const DEFAULT_CONFIG = {
  plan: {
    namingFormat: '{date}-{issue}-{slug}',
    dateFormat: 'YYMMDD-HHmm',
    issuePrefix: null,
    reportsDir: 'reports',
    resolution: {
      order: ['session', 'branch'],
      branchPattern: '(?:feat|fix|chore|refactor|docs)/(?:[^/]+/)?(.+)'
    }
  },
  paths: {
    docs: 'docs',
    plans: 'plans'
  },
  locale: {
    responseLanguage: null
  },
  trust: {
    passphrase: null,
    enabled: false
  },
  project: {
    type: 'auto',
    packageManager: 'auto',
    framework: 'auto'
  },
  assertions: []
};

/**
 * Deep merge objects (source values override target, nested objects merged recursively)
 * Arrays are replaced entirely (not concatenated) to avoid duplicate entries
 * @param {Object} target - Base object
 * @param {Object} source - Object to merge (takes precedence)
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;

  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = target[key];

    // Arrays: replace entirely (don't concatenate)
    if (Array.isArray(sourceVal)) {
      result[key] = [...sourceVal];
    }
    // Objects: recurse (but not null)
    else if (sourceVal !== null && typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
      result[key] = deepMerge(targetVal || {}, sourceVal);
    }
    // Primitives: source wins
    else {
      result[key] = sourceVal;
    }
  }
  return result;
}

/**
 * Load config from a specific file path
 * @param {string} configPath - Path to config file
 * @returns {Object|null} Parsed config or null if not found/invalid
 */
function loadConfigFromPath(configPath) {
  try {
    if (!fs.existsSync(configPath)) return null;
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

/**
 * Get session file path (delegates to gk-session-manager)
 *
 * NOTE: This now returns the path in ~/.gemkit/projects/{projectDir}/
 * NOT in os.tmpdir() as before.
 *
 * @param {string} gkSessionId - GemKit session ID (format: {appName}-{PID}-{ts36}-{rand4})
 * @returns {string} Path to session file
 */
function getSessionTempPath(gkSessionId) {
  const projectDir = sessionManager.getProjectDirFromEnv();
  return sessionManager.getSessionPath(projectDir, gkSessionId);
}

/**
 * Read session state from session file
 *
 * NOTE: Reads from ~/.gemkit/projects/{projectDir}/ NOT os.tmpdir()
 *
 * @param {string} gkSessionId - GemKit session ID (format: {appName}-{PID}-{ts36}-{rand4})
 * @returns {Object|null} Session state or null
 */
function readSessionState(gkSessionId) {
  if (!gkSessionId) return null;
  const projectDir = sessionManager.getProjectDirFromEnv();
  return sessionManager.getSession(projectDir, gkSessionId);
}

/**
 * Write/update session state to session file
 *
 * NOTE: Writes to ~/.gemkit/projects/{projectDir}/ NOT os.tmpdir()
 *
 * @param {string} gkSessionId - GemKit session ID (format: {appName}-{PID}-{ts36}-{rand4})
 * @param {Object} state - State object to persist (merged with existing)
 * @returns {boolean} Success status
 */
function writeSessionState(gkSessionId, state) {
  if (!gkSessionId) return false;
  const projectDir = sessionManager.getProjectDirFromEnv();

  // Get existing session and merge with new state
  const existing = sessionManager.getSession(projectDir, gkSessionId);
  if (existing) {
    // Merge: preserve existing fields, update with new state
    const merged = { ...existing, ...state };
    return sessionManager.saveSession(projectDir, gkSessionId, merged);
  } else {
    // No existing session - create new one
    return sessionManager.saveSession(projectDir, gkSessionId, state);
  }
}

/**
 * Sanitize slug to prevent path traversal
 * @param {string} slug - Slug to sanitize
 * @returns {string} Sanitized slug
 */
function sanitizeSlug(slug) {
  if (!slug) return '';
  return slug.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').slice(0, 100);
}

/**
 * Extract feature slug from git branch name
 * Pattern: (?:feat|fix|chore|refactor|docs)/(?:[^/]+/)?(.+)
 * @param {string} branch - Git branch name
 * @param {string} pattern - Regex pattern (optional)
 * @returns {string|null} Extracted slug or null
 */
function extractSlugFromBranch(branch, pattern) {
  if (!branch) return null;
  const defaultPattern = /(?:feat|fix|chore|refactor|docs)\/(?:[^\/]+\/)?(.+)/;
  const regex = pattern ? new RegExp(pattern) : defaultPattern;
  const match = branch.match(regex);
  return match ? sanitizeSlug(match[1]) : null;
}

/**
 * Find most recent plan folder by timestamp prefix
 * @param {string} plansDir - Plans directory path
 * @returns {string|null} Most recent plan path or null
 */
function findMostRecentPlan(plansDir) {
  try {
    if (!fs.existsSync(plansDir)) return null;
    const entries = fs.readdirSync(plansDir, { withFileTypes: true });
    const planDirs = entries
      .filter(e => e.isDirectory() && /^\d{6}/.test(e.name))
      .map(e => e.name)
      .sort()
      .reverse();
    return planDirs.length > 0 ? path.join(plansDir, planDirs[0]) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Safely execute shell command (internal helper)
 * SECURITY: Only accepts whitelisted git read commands
 * @param {string} cmd - Command to execute
 * @returns {string|null} Command output or null
 */
function execSafe(cmd) {
  // Whitelist of safe read-only commands
  const allowedCommands = ['git branch --show-current', 'git rev-parse --abbrev-ref HEAD'];
  if (!allowedCommands.includes(cmd)) {
    return null;
  }

  try {
    return require('child_process')
      .execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      .trim();
  } catch (e) {
    return null;
  }
}

/**
 * Resolve active plan path using cascading resolution with tracking
 *
 * Resolution semantics:
 * - 'session': Explicitly set via set-active-plan → ACTIVE (directive)
 * - 'branch': Matched from git branch name → SUGGESTED (hint only)
 *
 * @param {string} sessionId - Session identifier (optional)
 * @param {Object} config - Gemini-kit config
 * @returns {{ path: string|null, resolvedBy: 'session'|'branch'|null }} Resolution result with tracking
 */
function resolvePlanPath(sessionId, config) {
  const plansDir = config?.paths?.plans || 'plans';
  const resolution = config?.plan?.resolution || {};
  const order = resolution.order || ['session', 'branch'];
  const branchPattern = resolution.branchPattern;

  for (const method of order) {
    switch (method) {
      case 'session': {
        const state = readSessionState(sessionId);
        if (state?.activePlan) {
          // Only use session state if CWD matches session origin (monorepo support)
          if (state.projectRoot && state.projectRoot !== process.cwd()) {
            break;  // Fall through to branch
          }
          return { path: state.activePlan, resolvedBy: 'session' };
        }
        break;
      }
      case 'branch': {
        try {
          const branch = execSafe('git branch --show-current');
          const slug = extractSlugFromBranch(branch, branchPattern);
          if (slug && fs.existsSync(plansDir)) {
            const entries = fs.readdirSync(plansDir, { withFileTypes: true })
              .filter(e => e.isDirectory() && e.name.includes(slug));
            if (entries.length > 0) {
              return {
                path: path.join(plansDir, entries[entries.length - 1].name),
                resolvedBy: 'branch'
              };
            }
          }
        } catch (e) {
          // Ignore errors reading plans dir
        }
        break;
      }
    }
  }
  return { path: null, resolvedBy: null };
}

/**
 * Sanitize path values (prevent path traversal)
 */
function sanitizePath(pathValue, projectRoot) {
  if (!pathValue || typeof pathValue !== 'string') return pathValue;
  const resolved = path.resolve(projectRoot, pathValue);
  if (!resolved.startsWith(projectRoot + path.sep) && resolved !== projectRoot) {
    return null;
  }
  return pathValue;
}

/**
 * Validate and sanitize config paths
 */
function sanitizeConfig(config, projectRoot) {
  const result = { ...config };

  if (result.plan) {
    result.plan = { ...result.plan };
    if (!sanitizePath(result.plan.reportsDir, projectRoot)) {
      result.plan.reportsDir = DEFAULT_CONFIG.plan.reportsDir;
    }
    // Merge resolution defaults
    result.plan.resolution = {
      ...DEFAULT_CONFIG.plan.resolution,
      ...result.plan.resolution
    };
  }

  if (result.paths) {
    result.paths = { ...result.paths };
    if (!sanitizePath(result.paths.docs, projectRoot)) {
      result.paths.docs = DEFAULT_CONFIG.paths.docs;
    }
    if (!sanitizePath(result.paths.plans, projectRoot)) {
      result.paths.plans = DEFAULT_CONFIG.paths.plans;
    }
  }

  if (result.locale) {
    result.locale = { ...result.locale };
  }

  return result;
}

/**
 * Load config with cascading resolution: DEFAULT → global → local
 *
 * Resolution order (each layer overrides the previous):
 *   1. DEFAULT_CONFIG (hardcoded defaults)
 *   2. Global config (~/.gemini/.gk.json) - user preferences
 *   3. Local config (./.gemini/.gk.json) - project-specific overrides
 *
 * @param {Object} options - Options for config loading
 * @param {boolean} options.includeProject - Include project section (default: true)
 * @param {boolean} options.includeAssertions - Include assertions (default: true)
 * @param {boolean} options.includeLocale - Include locale section (default: true)
 */
function loadConfig(options = {}) {
  const { includeProject = true, includeAssertions = true, includeLocale = true } = options;
  const projectRoot = process.cwd();

  // Load configs from both locations
  const globalConfig = loadConfigFromPath(GLOBAL_CONFIG_PATH);
  const localConfig = loadConfigFromPath(LOCAL_CONFIG_PATH);

  // No config files found - use defaults
  if (!globalConfig && !localConfig) {
    return getDefaultConfig(includeProject, includeAssertions, includeLocale);
  }

  try {
    // Deep merge: DEFAULT → global → local (local wins)
    let merged = deepMerge({}, DEFAULT_CONFIG);
    if (globalConfig) merged = deepMerge(merged, globalConfig);
    if (localConfig) merged = deepMerge(merged, localConfig);

    // Build result with optional sections
    const result = {
      plan: merged.plan || DEFAULT_CONFIG.plan,
      paths: merged.paths || DEFAULT_CONFIG.paths
    };

    if (includeLocale) {
      result.locale = merged.locale || DEFAULT_CONFIG.locale;
    }
    // Always include trust config for verification
    result.trust = merged.trust || DEFAULT_CONFIG.trust;
    if (includeProject) {
      result.project = merged.project || DEFAULT_CONFIG.project;
    }
    if (includeAssertions) {
      result.assertions = merged.assertions || [];
    }

    // Include spawn and notifications config (pass through from merged)
    if (merged.spawn) {
      result.spawn = merged.spawn;
    }
    if (merged.notifications) {
      result.notifications = merged.notifications;
    }

    return sanitizeConfig(result, projectRoot);
  } catch (e) {
    return getDefaultConfig(includeProject, includeAssertions, includeLocale);
  }
}

/**
 * Get default config with optional sections
 */
function getDefaultConfig(includeProject = true, includeAssertions = true, includeLocale = true) {
  const result = {
    plan: { ...DEFAULT_CONFIG.plan },
    paths: { ...DEFAULT_CONFIG.paths }
  };
  if (includeLocale) {
    result.locale = { ...DEFAULT_CONFIG.locale };
  }
  if (includeProject) {
    result.project = { ...DEFAULT_CONFIG.project };
  }
  if (includeAssertions) {
    result.assertions = [];
  }
  return result;
}

/**
 * Get reports path based on plan resolution
 * Only uses plan-specific path for 'session' resolved plans (explicitly active)
 * Branch-matched (suggested) plans use default path to avoid pollution
 *
 * @param {string|null} planPath - The plan path
 * @param {string|null} resolvedBy - How plan was resolved ('session'|'branch'|null)
 * @param {Object} planConfig - Plan configuration
 * @param {Object} pathsConfig - Paths configuration
 * @returns {string} Reports path
 */
function getReportsPath(planPath, resolvedBy, planConfig, pathsConfig) {
  // Only use plan-specific reports path if explicitly active (session state)
  if (planPath && resolvedBy === 'session') {
    return `${planPath}/${planConfig.reportsDir}/`;
  }
  // Default path for no plan or suggested (branch-matched) plans
  return `${pathsConfig.plans}/${planConfig.reportsDir}/`;
}

/**
 * Format issue ID with prefix
 */
function formatIssueId(issueId, planConfig) {
  if (!issueId) return null;
  return planConfig.issuePrefix ? `${planConfig.issuePrefix}${issueId}` : `#${issueId}`;
}

/**
 * Extract issue ID from branch name
 */
function extractIssueFromBranch(branch) {
  if (!branch) return null;
  const patterns = [
    /(?:issue|gh|fix|feat|bug)[/-]?(\d+)/i,
    /[/-](\d+)[/-]/,
    /#(\d+)/
  ];
  for (const pattern of patterns) {
    const match = branch.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Get a value from session state (helper for other hooks)
 * Use this instead of process.env.GK_* since Gemini CLI doesn't provide env file
 *
 * @param {string} sessionId - Session identifier
 * @param {string} key - State key to retrieve
 * @param {*} defaultValue - Default value if not found
 * @returns {*} State value or default
 */
function getSessionValue(sessionId, key, defaultValue = null) {
  const state = readSessionState(sessionId);
  if (!state) return defaultValue;
  return state[key] !== undefined ? state[key] : defaultValue;
}

module.exports = {
  // Path constants
  CONFIG_PATH,
  LOCAL_CONFIG_PATH,
  GLOBAL_CONFIG_PATH,
  DEFAULT_CONFIG,

  // Deep merge
  deepMerge,

  // Config loading
  loadConfigFromPath,
  loadConfig,

  // Path utilities
  sanitizePath,
  sanitizeConfig,

  // Session state
  getSessionTempPath,
  readSessionState,
  writeSessionState,
  getSessionValue,  // NEW: Helper for other hooks

  // Plan resolution
  resolvePlanPath,
  extractSlugFromBranch,
  findMostRecentPlan,
  getReportsPath,

  // Issue utilities
  formatIssueId,
  extractIssueFromBranch
};