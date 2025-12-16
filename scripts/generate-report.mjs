#!/usr/bin/env node

/**
 * Notion Status Report Generator
 *
 * Reads raw Notion data and generates an HTML status report.
 * Filters out internal projects, categorizes by priority and client,
 * and updates the report HTML file.
 *
 * Input: data/notion-raw.json (from fetch-notion-data.mjs)
 * Output: NOTION_PROJECT_STATUS.html
 */

import fs from 'fs';
import path from 'path';

// Priority levels and colors
const PRIORITY_LEVELS = {
  'URGENT': { value: 1, color: '#e74c3c' },
  'HIGH': { value: 2, color: '#f39c12' },
  'MEDIUM': { value: 3, color: '#3498db' },
  'LOW': { value: 4, color: '#27ae60' }
};

// Target clients (exclude internal projects like 'RV 2.0')
const TARGET_CLIENTS = ['CBB', 'DLC', 'Wise Loan'];

async function generateReport() {
  try {
    // Read raw Notion data
    const dataPath = path.join(process.cwd(), 'data', 'notion-raw.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${dataPath}`);
    }

    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Processing ${rawData.itemCount} items from Notion...`);

    // Filter for target clients only
    const items = rawData.items.filter(item =>
      TARGET_CLIENTS.some(client => item.client?.includes(client))
    );
    console.log(`Filtered to ${items.length} items for target clients`);

    // Group items by priority
    const byPriority = {};
    Object.keys(PRIORITY_LEVELS).forEach(level => {
      byPriority[level] = [];
    });

    items.forEach(item => {
      const priority = item.priority || 'LOW';
      // Handle priority like "1 - URGENT", "2 - HIGH", etc.
      const priorityName = priority.split('-').pop().trim().toUpperCase();
      if (byPriority[priorityName]) {
        byPriority[priorityName].push(item);
      } else {
        console.warn(`Unknown priority: "${priority}" -> "${priorityName}"`);
      }
    });

    // Group by client within each priority
    const groupedByPriorityAndClient = {};
    Object.entries(byPriority).forEach(([priority, priorityItems]) => {
      groupedByPriorityAndClient[priority] = {};
      priorityItems.forEach(item => {
        const client = item.client || 'Unknown';
        if (!groupedByPriorityAndClient[priority][client]) {
          groupedByPriorityAndClient[priority][client] = [];
        }
        groupedByPriorityAndClient[priority][client].push(item);
      });
    });

    // Generate HTML sections for each priority
    let sectionsHtml = '';

    const priorityOrder = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

    priorityOrder.forEach(priority => {
      const color = PRIORITY_LEVELS[priority].color;
      const itemsByClient = groupedByPriorityAndClient[priority];

      if (Object.keys(itemsByClient).length === 0) {
        console.log(`Skipping ${priority}: no items`);
        return;
      }
      console.log(`Adding ${priority} section with ${Object.keys(itemsByClient).length} clients`);

      const priorityLabel = priority === 'URGENT' ? '1 - URGENT Priority' :
                          priority === 'HIGH' ? '2 - HIGH' :
                          priority === 'MEDIUM' ? '3 - MEDIUM' : '4 - LOW';

      sectionsHtml += `
            <section>
                <h2 style="border-bottom-color: ${color}; color: ${color};">${priorityLabel} Issues</h2>
`;

      Object.entries(itemsByClient).forEach(([client, clientItems]) => {
        sectionsHtml += `
                <h3>${client}</h3>
`;
        clientItems.forEach((item, index) => {
          const status = item.status || 'Unknown';
          sectionsHtml += `
                <div class="issue" style="border-left-color: ${color};">
                    <strong>${index + 1}. ${item.name}</strong>
                    <div style="color: #666; font-size: 14px; margin: 8px 0;">
                        Status: <span style="color: ${color}; font-weight: bold;">${status}</span> | Priority: ${priority}
                    </div>
`;
          if (item.updates) {
            // Escape HTML and limit to 500 chars
            const safeUpdates = item.updates
              .substring(0, 500)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            sectionsHtml += `
                    <div style="color: #444; margin: 8px 0;">${safeUpdates}${item.updates.length > 500 ? '...' : ''}</div>
`;
          }
          sectionsHtml += `
                </div>
`;
        });
      });

      sectionsHtml += `
            </section>
`;
    });

    // Read existing HTML template
    const templatePath = path.join(process.cwd(), 'NOTION_PROJECT_STATUS.html');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    let html = fs.readFileSync(templatePath, 'utf-8');

    // Update report date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Replace date in header
    html = html.replace(
      /<p>December \d+, \d+<\/p>/,
      `<p>${dateStr}</p>`
    );

    // Replace date in footer
    html = html.replace(
      /Report Date:<\/strong> December \d+, \d+/,
      `Report Date:</strong> ${dateStr}`
    );

    // Replace content section
    // Find the content div and replace its inner HTML
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>\s*<footer>/);
    if (!contentMatch) {
      throw new Error('Could not find content section in template HTML');
    }

    const newContent = `<div class="content">
            <div class="summary">
                <p>The product roadmap contains <strong>${items.length} active items</strong> across three primary clients (CBB, DLC, Wise Loan). Below is a breakdown of issues by priority and status.</p>
            </div>

${sectionsHtml}
        </div>

        <footer>`;

    html = html.replace(contentMatch[0], newContent);

    // Write updated HTML
    fs.writeFileSync(templatePath, html);
    console.log(`\nSuccessfully generated report with ${items.length} items`);
    console.log(`Report date: ${dateStr}`);
    console.log(`Output: ${templatePath}`);

  } catch (error) {
    console.error('Error generating report:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateReport();
