#!/usr/bin/env node
/**
 * Screenshot Capture Script
 *
 * Captures screenshots for documentation using Playwright.
 * Run: node scripts/capture-screenshots.cjs
 *
 * Prerequisites: npx playwright install chromium
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '../docs/assets/screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Screenshot configurations
const SCREENSHOTS = [
  // === GitHub Repository Pages ===
  {
    name: 'github-repo-main.png',
    url: 'https://github.com/razorvision/project-intake-template',
    description: 'Repository main page',
    waitFor: 'networkidle'
  },
  {
    name: 'github-labels.png',
    url: 'https://github.com/razorvision/project-intake-template/labels',
    description: 'GitHub labels page',
    waitFor: 'networkidle'
  },
  {
    name: 'github-issue-templates.png',
    url: 'https://github.com/razorvision/project-intake-template/issues/new/choose',
    description: 'Issue template chooser',
    waitFor: 'networkidle'
  },
  {
    name: 'github-actions.png',
    url: 'https://github.com/razorvision/project-intake-template/actions',
    description: 'GitHub Actions workflows',
    waitFor: 'networkidle'
  },
  {
    name: 'github-pull-requests.png',
    url: 'https://github.com/razorvision/project-intake-template/pulls',
    description: 'Pull requests list',
    waitFor: 'networkidle'
  },

  // === OAuth Setup Documentation Pages ===
  {
    name: 'github-oauth-docs.png',
    url: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app',
    description: 'GitHub OAuth app creation docs',
    waitFor: 'networkidle'
  },
  {
    name: 'google-oauth-docs.png',
    url: 'https://developers.google.com/identity/protocols/oauth2',
    description: 'Google OAuth documentation',
    waitFor: 'networkidle'
  },

  // === Database Provider Pages ===
  {
    name: 'supabase-landing.png',
    url: 'https://supabase.com/',
    description: 'Supabase landing page',
    waitFor: 'domcontentloaded'
  },
  {
    name: 'neon-landing.png',
    url: 'https://neon.tech/',
    description: 'Neon database landing',
    waitFor: 'networkidle'
  },
  {
    name: 'planetscale-landing.png',
    url: 'https://planetscale.com/',
    description: 'PlanetScale landing',
    waitFor: 'networkidle'
  },

  // === Deployment/Hosting Pages ===
  {
    name: 'vercel-landing.png',
    url: 'https://vercel.com/dashboard',
    description: 'Vercel dashboard',
    waitFor: 'networkidle'
  },

  // === Monitoring Pages ===
  {
    name: 'sentry-landing.png',
    url: 'https://sentry.io/',
    description: 'Sentry landing page',
    waitFor: 'networkidle'
  },

  // === Documentation Examples ===
  {
    name: 'nextauth-docs.png',
    url: 'https://next-auth.js.org/getting-started/introduction',
    description: 'NextAuth.js documentation',
    waitFor: 'networkidle'
  },
  {
    name: 'prisma-docs.png',
    url: 'https://www.prisma.io/docs',
    description: 'Prisma documentation',
    waitFor: 'domcontentloaded'
  }
];

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log('📸 Starting screenshot capture...\n');
  console.log(`   Target: ${SCREENSHOTS.length} screenshots\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < SCREENSHOTS.length; i++) {
    const shot = SCREENSHOTS[i];
    console.log(`${i + 1}/${SCREENSHOTS.length}. ${shot.description}...`);

    try {
      await page.goto(shot.url, {
        waitUntil: shot.waitFor || 'networkidle',
        timeout: 60000
      });

      // Wait a bit for any animations to settle
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, shot.name),
        fullPage: false
      });

      console.log(`   ✅ Saved: ${shot.name}`);
      successCount++;
    } catch (e) {
      console.log(`   ⚠️ Failed: ${e.message.substring(0, 50)}...`);
      failCount++;
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(50));
  console.log('✨ Screenshot capture complete!');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⚠️ Failed: ${failCount}`);
  console.log(`   📁 Location: ${SCREENSHOTS_DIR}`);

  // List captured files
  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'));
  if (files.length > 0) {
    console.log('\n📁 All screenshots:');
    files.sort().forEach(f => console.log(`   - ${f}`));
  }
}

captureScreenshots().catch(console.error);
