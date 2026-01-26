#!/usr/bin/env node
/**
 * GK Discord Simple Sender - Utility for manual Discord notifications
 *
 * GEMINI-KIT ADAPTATION:
 * - Format: CommonJS (Node.js)
 * - Environment loading: Same priority as gk-discord-notify.cjs
 *
 * Usage:
 *   node send-discord.cjs "Your message here"
 *   node send-discord.cjs "Line 1\nLine 2"
 *
 * Exit Codes:
 *   0 - Success
 *   1 - Missing webhook URL or failed to send
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT LOADING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Load environment variables with priority:
 * 1. process.env (highest - already loaded)
 * 2. .gemini/.env (medium)
 * 3. .gemini/hooks/notifications/.env (lowest)
 */
function loadEnv() {
  const env = { ...process.env };

  const envFiles = [
    path.join(__dirname, '.env'),
    path.join(process.cwd(), '.gemini', '.env')
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
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
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
 */
function sendDiscordEmbed(webhookUrl, message) {
  return new Promise((resolve, reject) => {
    const projectName = path.basename(process.cwd());

    const embed = {
      title: '🤖 Gemini CLI Session Complete',
      description: message,
      color: 5763719,
      timestamp: new Date().toISOString(),
      footer: {
        text: `Project Name • ${projectName}`
      },
      fields: [
        {
          name: '⏰ Session Time',
          value: new Date().toLocaleTimeString(),
          inline: true
        },
        {
          name: '📂 Project',
          value: projectName,
          inline: true
        }
      ]
    };

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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const message = process.argv[2];

  if (!message) {
    console.log('Usage: node send-discord.cjs "Your message here"');
    process.exit(1);
  }

  const env = loadEnv();
  const webhookUrl = env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('⚠️  Discord notification skipped: DISCORD_WEBHOOK_URL not set');
    process.exit(1);
  }

  try {
    await sendDiscordEmbed(webhookUrl, message);
    console.log('✅ Discord notification sent');
    process.exit(0);
  } catch (error) {
    console.log(`❌ Failed to send Discord notification: ${error.message}`);
    process.exit(1);
  }
}

main();