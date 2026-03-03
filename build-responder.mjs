import https from 'https';

const n8nKey = process.env.N8N_API_KEY_WORK;
const SHEET_ID = '1WfX-Yy61Jb1PRKXVs3TG6lFmFc0mkBYIF9TZbv1RTY0';
const GSHEETS_CRED_ID = 'DXbFUOqwi025RtyQ';
const HARVEST_CRED_ID = 'a1TAJwRJA7HZ9DTY';
const SLACK_CRED_ID = '5TsqK744dpKhRnHa';
const HARVEST_ACCOUNT_ID = '869362';

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'work-n8n.tuckercorp.org',
      path,
      method,
      headers: {
        'X-N8N-API-KEY': n8nKey,
        'Content-Type': 'application/json',
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`${res.statusCode}: ${body.slice(0, 500)}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// ─── Node definitions ───

const nodes = [
  // ── 1. Webhook: receives Slack interaction payloads ──
  {
    id: 'webhook',
    name: 'Slack Interaction',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: [0, 300],
    webhookId: 'harvest-review-actions',
    parameters: {
      path: 'harvest-review-actions',
      httpMethod: 'POST',
      responseMode: 'responseNode',
      options: {}
    }
  },

  // ── 2. Parse Slack's form-urlencoded payload ──
  {
    id: 'parse',
    name: 'Parse Slack Payload',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [260, 300],
    parameters: {
      jsCode: `
// Slack sends application/x-www-form-urlencoded with payload=<JSON string>
const raw = $input.first().json;

let payload;
if (typeof raw.payload === 'string') {
  payload = JSON.parse(raw.payload);
} else if (raw.body && typeof raw.body === 'string') {
  const match = raw.body.match(/payload=(.+)/);
  if (match) {
    payload = JSON.parse(decodeURIComponent(match[1]));
  } else {
    payload = JSON.parse(raw.body);
  }
} else if (raw.body?.payload) {
  payload = typeof raw.body.payload === 'string'
    ? JSON.parse(raw.body.payload)
    : raw.body.payload;
} else {
  throw new Error('Could not parse Slack payload from: ' + JSON.stringify(Object.keys(raw)));
}

const action = payload.actions?.[0] || {};
const actionId = action.action_id || '';

// Button value is a JSON string; select uses selected_option.value
let value = {};
if (action.type === 'static_select' && action.selected_option?.value) {
  try { value = JSON.parse(action.selected_option.value); } catch (_) {}
} else if (action.value) {
  try { value = JSON.parse(action.value); } catch (_) {}
}

// Determine action category
let category = 'dismiss';
if (actionId === 'harvest_add_tag' || actionId === 'harvest_different_tag') {
  category = 'tag';
} else if (actionId === 'harvest_ignore_keyword') {
  category = 'ignore';
} else if (actionId === 'harvest_open_harvest') {
  // URL button: just acknowledge, don't update the message or log
  category = 'noop';
}

// Extract flag type from block_id: "flag_{entryId}_{flagType}"
const blockId = action.block_id || '';
const flagType = blockId.replace(/^flag_\\d+_/, '') || category;

return [{
  json: {
    actionId,
    category,
    value,
    flagType,
    channel: payload.channel?.id || '',
    messageTs: payload.message?.ts || '',
    user: payload.user?.username || payload.user?.name || 'unknown',
    originalBlocks: payload.message?.blocks || [],
  }
}];
`
    }
  },

  // ── 3. Acknowledge Slack immediately (200 OK, empty body) ──
  {
    id: 'respond',
    name: 'Acknowledge Slack',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.5,
    position: [520, 300],
    parameters: {
      respondWith: 'noData',
    }
  },

  // ── 4. Route by action category ──
  {
    id: 'route',
    name: 'Route Action',
    type: 'n8n-nodes-base.switch',
    typeVersion: 3.4,
    position: [780, 300],
    parameters: {
      mode: 'expression',
      output: "={{ ({'tag': 0, 'ignore': 1, 'dismiss': 2, 'noop': 3})[$json.category] ?? 2 }}",
      options: {}
    }
  },

  // ── 5a. Tag branch: fetch current Harvest entry ──
  {
    id: 'fetch-entry',
    name: 'Fetch Harvest Entry',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1040, 100],
    credentials: {
      httpHeaderAuth: { id: HARVEST_CRED_ID, name: 'Harvest PAT' }
    },
    parameters: {
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      url: '=https://api.harvestapp.com/v2/time_entries/{{ $json.value.entryId }}',
      method: 'GET',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Harvest-Account-Id', value: HARVEST_ACCOUNT_ID },
          { name: 'User-Agent', value: 'n8n-harvest-evaluator' }
        ]
      },
      options: {}
    }
  },

  // ── 5b. Tag branch: build PATCH body with tag prepended ──
  {
    id: 'build-tag',
    name: 'Build Tag Patch',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1300, 100],
    parameters: {
      jsCode: `
const parsed = $node['Parse Slack Payload'].json;
const entry = $input.first().json;
const tag = parsed.value.tag;
const currentNotes = (entry.notes || '').trim();
const newNotes = tag + ' ' + currentNotes;

return [{
  json: {
    harvestPatchBody: JSON.stringify({ notes: newNotes }),
    entryId: parsed.value.entryId,
  }
}];
`
    }
  },

  // ── 5c. Tag branch: PATCH the Harvest entry ──
  {
    id: 'patch-tag',
    name: 'Apply Tag to Entry',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1560, 100],
    credentials: {
      httpHeaderAuth: { id: HARVEST_CRED_ID, name: 'Harvest PAT' }
    },
    parameters: {
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      url: '=https://api.harvestapp.com/v2/time_entries/{{ $json.entryId }}',
      method: 'PATCH',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ $json.harvestPatchBody }}',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Harvest-Account-Id', value: HARVEST_ACCOUNT_ID },
          { name: 'User-Agent', value: 'n8n-harvest-evaluator' }
        ]
      },
      options: {}
    }
  },

  // ── 6. Ignore branch: build ignore list entry ──
  {
    id: 'build-ignore',
    name: 'Build Ignore Entry',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1040, 500],
    parameters: {
      jsCode: `
const parsed = $node['Parse Slack Payload'].json;
const today = new Date().toISOString().slice(0, 10);

return [{
  json: {
    ignorePayload: JSON.stringify({
      values: [[
        parsed.value.keyword || '',
        parsed.value.client || '',
        '@' + parsed.user,
        today,
        parsed.flagType || 'missing_tag',
      ]]
    }),
  }
}];
`
    }
  },

  // ── 7b. Ignore branch: append to Ignore Patterns sheet ──
  {
    id: 'append-ignore',
    name: 'Add to Ignore List',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1300, 500],
    credentials: {
      googleSheetsOAuth2Api: { id: GSHEETS_CRED_ID, name: 'Google Sheets account' }
    },
    parameters: {
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleSheetsOAuth2Api',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/'Ignore Patterns'!A:E:append?valueInputOption=USER_ENTERED`,
      method: 'POST',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ $json.ignorePayload }}',
      options: {}
    }
  },

  // ── 8. All branches converge: build Slack update + review log ──
  {
    id: 'build-final',
    name: 'Build Final Updates',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1820, 300],
    parameters: {
      jsCode: `
const parsed = $node['Parse Slack Payload'].json;

// Determine result text based on action
let resultText = '';
const tag = parsed.value?.tag || '';
const keyword = parsed.value?.keyword || '';

if (parsed.category === 'tag') {
  resultText = ':white_check_mark: Tagged as ' + tag + ' by @' + parsed.user;
} else if (parsed.category === 'ignore') {
  resultText = ":no_entry_sign: '" + keyword + "' added to ignore list by @" + parsed.user;
} else {
  resultText = ':heavy_minus_sign: Dismissed by @' + parsed.user;
}

// Build updated Slack blocks: replace only the clicked flag's actions block
// with a result context block, keep all other blocks intact
const clickedBlockId = parsed.value?.entryId
  ? 'flag_' + parsed.value.entryId + '_' + parsed.flagType
  : '';

const updatedBlocks = [];
for (const b of (parsed.originalBlocks || [])) {
  if (b.type === 'actions' && b.block_id === clickedBlockId) {
    // Replace this flag's actions with result
    updatedBlocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: resultText }]
    });
  } else {
    updatedBlocks.push(b);
  }
}

// Build review log entry
const today = new Date().toISOString().slice(0, 10);
const logAction = parsed.actionId.replace('harvest_', '');
const entryId = String(parsed.value?.entryId || '');
const details = resultText.replace(/:[a-z_]+:/g, '').trim();

// Fallback text for Slack (used in notifications)
const fallbackText = details;

return [{
  json: {
    reviewLogPayload: JSON.stringify({
      values: [[today, '@' + parsed.user, logAction, entryId, parsed.flagType, details]]
    }),
    slackUpdatePayload: JSON.stringify({
      channel: parsed.channel,
      ts: parsed.messageTs,
      text: fallbackText,
      blocks: updatedBlocks,
    }),
  }
}];
`
    }
  },

  // ── 9. Append to Review Log sheet ──
  {
    id: 'append-log',
    name: 'Log Review Decision',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2080, 300],
    credentials: {
      googleSheetsOAuth2Api: { id: GSHEETS_CRED_ID, name: 'Google Sheets account' }
    },
    parameters: {
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleSheetsOAuth2Api',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/'Review Log'!A:F:append?valueInputOption=USER_ENTERED`,
      method: 'POST',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ $json.reviewLogPayload }}',
      options: {}
    }
  },

  // ── 10. Update the original Slack message (remove buttons, show result) ──
  {
    id: 'update-slack',
    name: 'Update Slack Message',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2340, 300],
    credentials: {
      slackApi: { id: SLACK_CRED_ID, name: 'Slack - BBCOM QA' }
    },
    parameters: {
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'slackApi',
      url: 'https://slack.com/api/chat.update',
      method: 'POST',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ $node["Build Final Updates"].json.slackUpdatePayload }}',
      options: {}
    }
  },
];

const connections = {
  'Slack Interaction': {
    main: [[{ node: 'Parse Slack Payload', type: 'main', index: 0 }]]
  },
  'Parse Slack Payload': {
    main: [[{ node: 'Acknowledge Slack', type: 'main', index: 0 }]]
  },
  'Acknowledge Slack': {
    main: [[{ node: 'Route Action', type: 'main', index: 0 }]]
  },
  'Route Action': {
    main: [
      // Output 0: tag actions
      [{ node: 'Fetch Harvest Entry', type: 'main', index: 0 }],
      // Output 1: ignore
      [{ node: 'Build Ignore Entry', type: 'main', index: 0 }],
      // Output 2: dismiss (pass through)
      [{ node: 'Build Final Updates', type: 'main', index: 0 }],
      // Output 3: noop (dead end, buttons stay)
    ]
  },
  // Tag branch
  'Fetch Harvest Entry': {
    main: [[{ node: 'Build Tag Patch', type: 'main', index: 0 }]]
  },
  'Build Tag Patch': {
    main: [[{ node: 'Apply Tag to Entry', type: 'main', index: 0 }]]
  },
  'Apply Tag to Entry': {
    main: [[{ node: 'Build Final Updates', type: 'main', index: 0 }]]
  },
  // Ignore branch
  'Build Ignore Entry': {
    main: [[{ node: 'Add to Ignore List', type: 'main', index: 0 }]]
  },
  'Add to Ignore List': {
    main: [[{ node: 'Build Final Updates', type: 'main', index: 0 }]]
  },
  // Common path
  'Build Final Updates': {
    main: [[{ node: 'Log Review Decision', type: 'main', index: 0 }]]
  },
  'Log Review Decision': {
    main: [[{ node: 'Update Slack Message', type: 'main', index: 0 }]]
  },
};

const RESPONDER_WORKFLOW_ID = '1GJcpro3VusanEcM';

async function main() {
  console.log('Updating responder workflow...');
  const updated = await apiCall('PUT', `/api/v1/workflows/${RESPONDER_WORKFLOW_ID}`, {
    name: 'Harvest Review - Slack Handler',
    nodes,
    connections,
    settings: { executionOrder: 'v1' },
  });

  console.log('Updated:', updated.id, '-', updated.name);
  console.log('Nodes:', updated.nodes.length);

  console.log('Activating...');
  try {
    await apiCall('POST', `/api/v1/workflows/${RESPONDER_WORKFLOW_ID}/activate`);
    console.log('Activated');
  } catch (e) {
    console.log('Activate note:', e.message.slice(0, 200));
  }
}

main().catch(e => console.error('Error:', e.message));
