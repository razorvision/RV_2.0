#!/usr/bin/env node

/**
 * Notion Database Fetcher
 *
 * Fetches data from a Notion database and outputs JSON for pipeline processing.
 *
 * Required environment variables:
 * - NOTION_API_TOKEN: Notion integration token
 * - NOTION_DATABASE_ID: Notion database ID
 *
 * Output: data/notion-raw.json
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

const NOTION_TOKEN = process.env.NOTION_API_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Validate required environment variables
if (!NOTION_TOKEN) {
  console.error('Error: Missing required environment variable: NOTION_API_TOKEN');
  process.exit(1);
}

if (!DATABASE_ID) {
  console.error('Error: Missing required environment variable: NOTION_DATABASE_ID');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

async function fetchNotionData() {
  try {
    console.log('Fetching Notion database metadata...');
    const dbMetaRes = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}`, { headers });

    if (!dbMetaRes.ok) {
      const errorText = await dbMetaRes.text();
      console.error(`Database fetch failed: ${dbMetaRes.status}`);
      console.error('Response:', errorText);
      process.exit(1);
    }

    const dbMeta = await dbMetaRes.json();
    const dbTitle = dbMeta.title?.[0]?.plain_text || 'Unknown Database';
    console.log(`Database title: ${dbTitle}`);

    // Query database
    console.log('Querying database...');
    const dbRes = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        page_size: 100
      })
    });

    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      console.error(`Database query failed: ${dbRes.status}`);
      console.error('Response:', errorText);
      process.exit(1);
    }

    const dbData = await dbRes.json();
    console.log(`Found ${dbData.results.length} items in database`);

    // Extract relevant data from each item
    const items = dbData.results.map(item => {
      const props = item.properties;
      return {
        id: item.id,
        name: props.Name?.title?.[0]?.plain_text || 'Untitled',
        status: props.Status?.status?.name || 'No status',
        priority: props.Priority?.select?.name || 'No priority',
        updates: props.Updates?.rich_text?.map(t => t.plain_text).join('') || '',
        client: props.Client?.select?.name || 'Unknown',
        url: item.url
      };
    });

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write JSON output
    const output = {
      database: {
        title: dbTitle,
        id: DATABASE_ID
      },
      items,
      fetchedAt: new Date().toISOString(),
      itemCount: items.length
    };

    const outputPath = path.join(dataDir, 'notion-raw.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\nSuccessfully wrote ${items.length} items to ${outputPath}`);
    return output;

  } catch (error) {
    console.error('Error fetching Notion data:', error.message);
    process.exit(1);
  }
}

// Run the fetcher
fetchNotionData();
