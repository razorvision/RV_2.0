import https from 'https';

const n8nKey = process.env.N8N_API_KEY_WORK;
const workflowId = '1BpEDRKZ6khUIpBX';
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
  // ── Triggers ──
  {
    id: 'webhook-trigger',
    name: 'Webhook Trigger',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: [0, 300],
    webhookId: 'harvest-time-evaluator',
    parameters: {
      path: 'harvest-time-evaluator',
      httpMethod: 'POST',
      responseMode: 'lastNode',
      options: {}
    }
  },
  {
    id: 'schedule-trigger',
    name: 'Monthly Schedule',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: [0, 540],
    parameters: {
      rule: {
        interval: [{ field: 'cronExpression', expression: '0 8 1 * *' }]
      }
    }
  },

  // ── Read all config from Google Sheets in one API call ──
  {
    id: 'read-sheets',
    name: 'Read All Config Sheets',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [280, 300],
    credentials: {
      googleSheetsOAuth2Api: { id: GSHEETS_CRED_ID, name: 'Google Sheets account' }
    },
    parameters: {
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleSheetsOAuth2Api',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?ranges=Clients!A:Z&ranges=Projects!A:Z&ranges='Team Members'!A:Z&ranges='Ignore Patterns'!A:Z&ranges=Settings!A:Z`,
      method: 'GET',
      options: {}
    }
  },

  // ── Parse sheets into structured config ──
  {
    id: 'build-config',
    name: 'Build Config',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [520, 300],
    parameters: {
      jsCode: `
// Parse Google Sheets batchGet response into structured config
const resp = $input.first().json;
const ranges = resp.valueRanges || [];

function parseSheet(rangeData) {
  const rows = rangeData.values || [];
  if (rows.length < 1) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
    return obj;
  });
}

const clientRows = parseSheet(ranges[0] || {});
const projectRows = parseSheet(ranges[1] || {});
const teamRows = parseSheet(ranges[2] || {});
const ignoreRows = parseSheet(ranges[3] || {});
const settingsRows = parseSheet(ranges[4] || {});

// Build settings map
const settings = {};
settingsRows.forEach(r => { settings[r.setting] = r.value; });

// Group clients: each unique client_name becomes one client entry
const clientMap = {};
clientRows.forEach(row => {
  const name = row.client_name;
  if (!clientMap[name]) {
    clientMap[name] = {
      name,
      clientId: parseInt(row.client_id, 10),
      tagKeywords: {},
      expectBillable: row.expect_billable === 'TRUE',
    };
  }
  // Each row adds a tag + keywords mapping
  if (row.tag && row.tag_keywords) {
    const tag = row.tag.replace(/[\\[\\]]/g, ''); // strip brackets
    const keywords = row.tag_keywords.split(',').map(k => k.trim()).filter(Boolean);
    clientMap[name].tagKeywords[tag] = keywords;
  }
});
const clients = Object.values(clientMap);

// Build project lookup by client
const projectsByClient = {};
projectRows.forEach(p => {
  const key = p.client_name;
  if (!projectsByClient[key]) projectsByClient[key] = [];
  projectsByClient[key].push({
    projectId: p.project_id,
    projectName: p.project_name,
    purpose: p.purpose || '',
    monthlyBudgetHours: p.monthly_budget_hours ? parseFloat(p.monthly_budget_hours) : null,
    notes: p.notes || '',
  });
});

// Build team member lookup
const teamMembers = {};
teamRows.forEach(t => {
  teamMembers[t.person] = (t.expected_tasks || '').split(',').map(s => s.trim()).filter(Boolean);
});

// Build ignore list
const ignorePatterns = ignoreRows.map(r => ({
  keyword: r.keyword,
  client: r.client,
  flagType: r.flag_type || 'missing_tag',
}));

// Calculate date range (previous month)
const now = new Date();
const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
const month = now.getMonth() === 0 ? 12 : now.getMonth();
const from = year + '-' + String(month).padStart(2, '0') + '-01';
const lastDay = new Date(year, month, 0).getDate();
const to = year + '-' + String(month).padStart(2, '0') + '-' + String(lastDay).padStart(2, '0');
const monthLabel = year + '-' + String(month).padStart(2, '0');

// Vague patterns from settings
const vagueWords = (settings.vague_words || 'meeting,work,misc,general,tasks,stuff,various').split(',').map(w => w.trim());
const minDescLen = parseInt(settings.min_description_length || '5', 10);
const slackChannel = settings.slack_channel || '#harvest-review';
const postDelayMs = parseInt(settings.post_delay_ms || '1500', 10);

return [{
  json: {
    clients,
    projectsByClient,
    teamMembers,
    ignorePatterns,
    vagueWords,
    minDescLen,
    slackChannel,
    postDelayMs,
    dateRange: { from, to },
    monthLabel,
    harvestAccountId: '${HARVEST_ACCOUNT_ID}',
  }
}];
`
    }
  },

  // ── Split into per-client items ──
  {
    id: 'loop-clients',
    name: 'Loop Clients',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [760, 300],
    parameters: {
      jsCode: `
const config = $input.first().json;
return config.clients.map(client => ({
  json: {
    ...client,
    harvestAccountId: config.harvestAccountId,
    dateRange: config.dateRange,
    monthLabel: config.monthLabel,
    vagueWords: config.vagueWords,
    minDescLen: config.minDescLen,
    slackChannel: config.slackChannel,
    postDelayMs: config.postDelayMs,
    teamMembers: config.teamMembers,
    ignorePatterns: config.ignorePatterns,
    projectConfig: config.projectsByClient[client.name] || [],
  }
}));
`
    }
  },

  // ── Fetch projects from Harvest ──
  {
    id: 'fetch-projects',
    name: 'Fetch Projects',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1000, 300],
    credentials: {
      httpHeaderAuth: { id: HARVEST_CRED_ID, name: 'Harvest PAT' }
    },
    parameters: {
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      url: "=https://api.harvestapp.com/v2/projects?client_id={{ $json.clientId }}&is_active=true&per_page=100",
      method: 'GET',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Harvest-Account-Id', value: `={{ $json.harvestAccountId }}` },
          { name: 'User-Agent', value: 'n8n-harvest-evaluator' }
        ]
      },
      options: {}
    }
  },

  // ── Fetch time entries from Harvest ──
  {
    id: 'fetch-entries',
    name: 'Fetch Time Entries',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1240, 300],
    credentials: {
      httpHeaderAuth: { id: HARVEST_CRED_ID, name: 'Harvest PAT' }
    },
    parameters: {
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      url: "=https://api.harvestapp.com/v2/time_entries?client_id={{ $node['Loop Clients'].json.clientId }}&from={{ $node['Loop Clients'].json.dateRange.from }}&to={{ $node['Loop Clients'].json.dateRange.to }}&per_page=2000",
      method: 'GET',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Harvest-Account-Id', value: `={{ $node['Loop Clients'].json.harvestAccountId }}` },
          { name: 'User-Agent', value: 'n8n-harvest-evaluator' }
        ]
      },
      options: {}
    }
  },

  // ── Evaluate all entries against 7 check types ──
  {
    id: 'evaluate',
    name: 'Evaluate Entries',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1480, 300],
    parameters: {
      jsCode: `
const clientConfig = $node['Loop Clients'].json;
const projectsData = $node['Fetch Projects'].json;
const entriesData = $node['Fetch Time Entries'].json;

const projects = projectsData.projects || [];
const entries = entriesData.time_entries || [];
const flags = [];

// Build project lookup (from Harvest API response)
const projectMap = {};
projects.forEach(p => { projectMap[p.id] = p; });

// Build project config lookup (from Google Sheet)
const projectConfigMap = {};
(clientConfig.projectConfig || []).forEach(pc => {
  projectConfigMap[pc.projectId] = pc;
});

// Vague patterns
const vaguePatterns = (clientConfig.vagueWords || []).map(p => new RegExp('^' + p + '$', 'i'));
const minLen = clientConfig.minDescLen || 5;

// Ignore list
const ignoreList = (clientConfig.ignorePatterns || []).filter(
  ip => ip.client === clientConfig.name || ip.client === ''
);

// Team members
const teamMembers = clientConfig.teamMembers || {};

// Track hours per project for budget check
const projectHours = {};

for (const entry of entries) {
  const notes = (entry.notes || '').trim();
  const project = projectMap[entry.project.id] || {};
  const projConfig = projectConfigMap[String(entry.project.id)] || {};
  const entryBase = {
    entryId: entry.id,
    date: entry.spent_date,
    user: entry.user.name,
    userId: entry.user.id,
    project: entry.project.name,
    projectId: entry.project.id,
    task: entry.task.name,
    hours: entry.hours,
    notes: notes,
    billable: entry.billable,
    projectPurpose: projConfig.purpose || '',
  };

  // Accumulate project hours
  const pid = String(entry.project.id);
  projectHours[pid] = (projectHours[pid] || 0) + entry.hours;

  // CHECK 1: Empty notes
  if (!notes || notes.length === 0) {
    flags.push({
      ...entryBase,
      flagType: 'empty_notes',
      severity: 'high',
      message: 'Time entry has no description',
    });
  }

  // CHECK 2: Vague descriptions
  if (notes && vaguePatterns.some(p => p.test(notes))) {
    flags.push({
      ...entryBase,
      flagType: 'vague_description',
      severity: 'medium',
      message: 'Description is too vague: "' + notes + '"',
    });
  }

  // CHECK 3: Short descriptions (but not empty)
  if (notes && notes.length > 0 && notes.length < minLen) {
    flags.push({
      ...entryBase,
      flagType: 'short_description',
      severity: 'low',
      message: 'Description is very short (' + notes.length + ' chars): "' + notes + '"',
    });
  }

  // CHECK 4: Missing tag (filtered by ignore list)
  if (clientConfig.tagKeywords) {
    for (const [tag, keywords] of Object.entries(clientConfig.tagKeywords)) {
      const bracketTag = '[' + tag + ']';
      const notesLower = notes.toLowerCase();
      const matchedKeyword = keywords.find(kw => notesLower.includes(kw.toLowerCase()));
      if (matchedKeyword && !notesLower.includes(bracketTag.toLowerCase())) {
        // Check ignore list
        const ignored = ignoreList.some(ip =>
          ip.keyword.toLowerCase() === matchedKeyword.toLowerCase() &&
          ip.flagType === 'missing_tag'
        );
        if (!ignored) {
          flags.push({
            ...entryBase,
            flagType: 'missing_tag',
            severity: 'high',
            message: 'Contains "' + matchedKeyword + '" but missing ' + bracketTag + ' tag',
            suggestedTag: bracketTag,
            matchedKeyword: matchedKeyword,
            availableTags: Object.keys(clientConfig.tagKeywords).map(t => '[' + t + ']'),
          });
        }
      }
    }
  }

  // CHECK 5: Billable mismatch
  if (clientConfig.expectBillable && !entry.billable && project.is_billable) {
    flags.push({
      ...entryBase,
      flagType: 'billable_mismatch',
      severity: 'medium',
      message: 'Entry is non-billable but project "' + entry.project.name + '" is billable',
    });
  }

  // CHECK 6: Role mismatch
  const expectedTasks = teamMembers[entry.user.name];
  if (expectedTasks && expectedTasks.length > 0) {
    const taskMatch = expectedTasks.some(et =>
      et.toLowerCase() === entry.task.name.toLowerCase()
    );
    if (!taskMatch) {
      flags.push({
        ...entryBase,
        flagType: 'role_mismatch',
        severity: 'medium',
        message: entry.user.name + ' logged "' + entry.task.name + '" but expected tasks are: ' + expectedTasks.join(', '),
        expectedTasks: expectedTasks,
      });
    }
  }
}

// CHECK 7: Budget warnings (project level, added to summary)
const budgetWarnings = [];
for (const pc of (clientConfig.projectConfig || [])) {
  if (pc.monthlyBudgetHours && pc.monthlyBudgetHours > 0) {
    const actual = projectHours[pc.projectId] || 0;
    const pct = Math.round((actual / pc.monthlyBudgetHours) * 100);
    if (pct > 110) {
      budgetWarnings.push({
        projectName: pc.projectName,
        budgetHours: pc.monthlyBudgetHours,
        actualHours: actual,
        pct,
        status: 'over_budget',
      });
    } else if (pct < 50 && actual > 0) {
      budgetWarnings.push({
        projectName: pc.projectName,
        budgetHours: pc.monthlyBudgetHours,
        actualHours: actual,
        pct,
        status: 'under_budget',
      });
    }
  }
}

// Build summary
const summary = {
  client: clientConfig.name,
  month: clientConfig.monthLabel,
  totalEntries: entries.length,
  totalHours: entries.reduce((s, e) => s + e.hours, 0),
  totalFlags: flags.length,
  flagsByType: {},
  flagsBySeverity: { high: 0, medium: 0, low: 0 },
  budgetWarnings,
  entriesAtLimit: entries.length >= 2000,
};

flags.forEach(f => {
  summary.flagsByType[f.flagType] = (summary.flagsByType[f.flagType] || 0) + 1;
  summary.flagsBySeverity[f.severity]++;
});

return [{
  json: {
    summary,
    flags,
    slackChannel: clientConfig.slackChannel,
    postDelayMs: clientConfig.postDelayMs,
    clientName: clientConfig.name,
    clientId: clientConfig.clientId,
  }
}];
`
    }
  },

  // ── Build Slack Block Kit messages ──
  {
    id: 'build-slack',
    name: 'Build Slack Messages',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1720, 300],
    parameters: {
      jsCode: `
const { summary, flags, slackChannel, postDelayMs, clientName, clientId } = $json;
const messages = [];

// ── Summary header message ──
const typeBreakdown = Object.entries(summary.flagsByType)
  .map(([type, count]) => type.replace(/_/g, ' ') + ': ' + count)
  .join(' | ');

const summaryBlocks = [
  {
    type: 'header',
    text: { type: 'plain_text', text: 'Harvest Review - ' + summary.client + ' - ' + summary.month }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*' + summary.totalEntries + '* entries | *' + summary.totalHours.toFixed(1) + '* hours | *' + summary.totalFlags + '* flags'
        + (summary.entriesAtLimit ? '\\n:warning: *Results may be incomplete* (hit 2000 entry limit)' : '')
    }
  },
];

if (summary.totalFlags > 0) {
  summaryBlocks.push({
    type: 'context',
    elements: [{
      type: 'mrkdwn',
      text: ':red_circle: High: ' + summary.flagsBySeverity.high
        + '  :large_orange_circle: Medium: ' + summary.flagsBySeverity.medium
        + '  :white_circle: Low: ' + summary.flagsBySeverity.low
        + '\\n' + typeBreakdown
    }]
  });
}

if (summary.budgetWarnings.length > 0) {
  const budgetText = summary.budgetWarnings.map(bw =>
    (bw.status === 'over_budget' ? ':chart_with_upwards_trend:' : ':chart_with_downwards_trend:')
    + ' *' + bw.projectName + '*: ' + bw.actualHours.toFixed(1) + 'h / ' + bw.budgetHours + 'h (' + bw.pct + '%)'
  ).join('\\n');
  summaryBlocks.push({
    type: 'section',
    text: { type: 'mrkdwn', text: '*Budget Alerts:*\\n' + budgetText }
  });
}

summaryBlocks.push({ type: 'divider' });

messages.push({
  json: {
    slackPayload: JSON.stringify({
      channel: slackChannel.replace(/^#/, ''),
      text: 'Harvest Review - ' + summary.client + ' - ' + summary.month + ': ' + summary.totalFlags + ' flags',
      blocks: summaryBlocks,
    }),
  }
});

// ── Per-flag messages ──
for (const flag of flags) {
  const purposeNote = flag.projectPurpose
    ? 'This is a _' + flag.projectPurpose.split(' - ')[0] + '_ project'
      + (flag.projectPurpose.includes(' - ') ? ' (' + flag.projectPurpose.split(' - ').slice(1).join(' - ') + ')' : '')
      + '.'
    : '';

  const entryInfo = '*' + flag.user + '* | ' + flag.date + ' | ' + flag.hours + 'h'
    + '\\n*' + flag.project + '* > ' + flag.task
    + (flag.notes ? '\\n> ' + flag.notes.replace(/\\n/g, ' ').slice(0, 200) : '\\n> _(no description)_');

  let blocks = [];
  let text = '';

  if (flag.flagType === 'missing_tag') {
    text = 'Missing Tag: ' + flag.suggestedTag + ' - ' + flag.user + ' - ' + flag.date;
    const question = purposeNote
      ? purposeNote + ' Should this entry be tagged?'
      : 'Should this entry be tagged?';

    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Missing Tag: ' + flag.suggestedTag + '*\\n\\n' + entryInfo
            + '\\n\\nMatched keyword: *' + flag.matchedKeyword + '*\\n' + question
        }
      },
      {
        type: 'actions',
        block_id: 'flag_' + flag.entryId + '_missing_tag',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Tag as ' + flag.suggestedTag },
            style: 'primary',
            action_id: 'harvest_add_tag',
            value: JSON.stringify({ entryId: flag.entryId, tag: flag.suggestedTag, currentNotes: flag.notes })
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Correct as-is' },
            action_id: 'harvest_dismiss',
            value: JSON.stringify({ entryId: flag.entryId, flagType: 'missing_tag' })
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: "Ignore '" + flag.matchedKeyword + "'" },
            style: 'danger',
            action_id: 'harvest_ignore_keyword',
            value: JSON.stringify({ keyword: flag.matchedKeyword, client: clientName, clientId })
          }
        ]
      }
    ];

    // Add tag dropdown if multiple tags available
    if (flag.availableTags && flag.availableTags.length > 1) {
      blocks[1].elements.splice(1, 0, {
        type: 'static_select',
        placeholder: { type: 'plain_text', text: 'Different tag...' },
        action_id: 'harvest_different_tag',
        options: flag.availableTags.map(t => ({
          text: { type: 'plain_text', text: t },
          value: JSON.stringify({ entryId: flag.entryId, tag: t })
        }))
      });
    }

  } else if (flag.flagType === 'billable_mismatch') {
    text = 'Billable Mismatch - ' + flag.user + ' - ' + flag.date;
    const question = purposeNote
      ? purposeNote + ' Is the non-billable marking intentional?'
      : 'This entry is marked *non-billable* but the project is billable. Is this intentional?';

    const dateParts = flag.date.split('-');
    const harvestEntryUrl = 'https://razorvision.harvestapp.com/time/day/' + dateParts[0] + '/' + parseInt(dateParts[1]) + '/' + parseInt(dateParts[2]) + '/' + flag.userId;
    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Billable Mismatch*\\n\\n' + entryInfo + '\\n\\n' + question
        }
      },
      {
        type: 'actions',
        block_id: 'flag_' + flag.entryId + '_billable_mismatch',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Fix in Harvest' },
            style: 'primary',
            url: harvestEntryUrl,
            action_id: 'harvest_open_harvest',
            value: JSON.stringify({ entryId: flag.entryId, flagType: 'billable_mismatch' })
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Non-billable is correct' },
            action_id: 'harvest_dismiss',
            value: JSON.stringify({ entryId: flag.entryId, flagType: 'billable_mismatch' })
          }
        ]
      }
    ];

  } else if (flag.flagType === 'empty_notes') {
    text = 'Empty Notes - ' + flag.user + ' - ' + flag.date;
    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Empty Notes*\\n\\n' + entryInfo
            + '\\n\\nThis entry has no description. ' + (purposeNote || '')
        }
      },
      {
        type: 'actions',
        block_id: 'flag_' + flag.entryId + '_empty_notes',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Acknowledged' },
            action_id: 'harvest_dismiss',
            value: JSON.stringify({ entryId: flag.entryId, flagType: 'empty_notes' })
          }
        ]
      }
    ];

  } else if (flag.flagType === 'vague_description') {
    text = 'Vague Description - ' + flag.user + ' - ' + flag.date;
    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Vague Description*\\n\\n' + entryInfo
            + '\\n\\nThis description is too generic to be useful. ' + (purposeNote || '')
        }
      },
      {
        type: 'actions',
        block_id: 'flag_' + flag.entryId + '_vague_description',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Acknowledged' },
            action_id: 'harvest_dismiss',
            value: JSON.stringify({ entryId: flag.entryId, flagType: 'vague_description' })
          }
        ]
      }
    ];

  } else if (flag.flagType === 'short_description') {
    text = 'Short Description - ' + flag.user + ' - ' + flag.date;
    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Short Description*\\n\\n' + entryInfo
            + '\\n\\nOnly ' + flag.notes.length + ' characters. ' + (purposeNote || '')
        }
      },
      {
        type: 'actions',
        block_id: 'flag_' + flag.entryId + '_short_description',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Acknowledged' },
            action_id: 'harvest_dismiss',
            value: JSON.stringify({ entryId: flag.entryId, flagType: 'short_description' })
          }
        ]
      }
    ];

  } else if (flag.flagType === 'role_mismatch') {
    text = 'Role Mismatch - ' + flag.user + ' - ' + flag.date;
    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Role Mismatch*\\n\\n' + entryInfo
            + '\\n\\n' + flag.user + ' logged *' + flag.task + '* but their expected tasks are: '
            + flag.expectedTasks.join(', ') + '. ' + (purposeNote || 'Is this correct?')
        }
      },
      {
        type: 'actions',
        block_id: 'flag_' + flag.entryId + '_role_mismatch',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Task is correct' },
            action_id: 'harvest_dismiss',
            value: JSON.stringify({ entryId: flag.entryId, flagType: 'role_mismatch' })
          }
        ]
      }
    ];
  }

  if (blocks.length > 0) {
    messages.push({
      json: {
        slackPayload: JSON.stringify({
          channel: slackChannel.replace(/^#/, ''),
          text,
          blocks,
        }),
      }
    });
  }
}

// If no flags, add an "all clear" message
if (flags.length === 0) {
  messages.push({
    json: {
      slackPayload: JSON.stringify({
        channel: slackChannel.replace(/^#/, ''),
        text: 'No flags found for ' + summary.client + ' - ' + summary.month,
        blocks: [{
          type: 'section',
          text: { type: 'mrkdwn', text: ':white_check_mark: No issues found. All entries look good.' }
        }],
      }),
    }
  });
}

return messages;
`
    }
  },

  // ── Post to Slack via HTTP Request (Slack node blocksUi doesn't support expressions) ──
  // n8n HTTP Request processes each input item separately, so 15 items = 15 API calls
  {
    id: 'post-slack',
    name: 'Post to Slack API',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1960, 300],
    credentials: {
      slackApi: { id: SLACK_CRED_ID, name: 'Slack - BBCOM QA' }
    },
    parameters: {
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'slackApi',
      url: 'https://slack.com/api/chat.postMessage',
      method: 'POST',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ $json.slackPayload }}',
      options: {}
    }
  },
];

const connections = {
  'Webhook Trigger': {
    main: [[{ node: 'Read All Config Sheets', type: 'main', index: 0 }]]
  },
  'Monthly Schedule': {
    main: [[{ node: 'Read All Config Sheets', type: 'main', index: 0 }]]
  },
  'Read All Config Sheets': {
    main: [[{ node: 'Build Config', type: 'main', index: 0 }]]
  },
  'Build Config': {
    main: [[{ node: 'Loop Clients', type: 'main', index: 0 }]]
  },
  'Loop Clients': {
    main: [[{ node: 'Fetch Projects', type: 'main', index: 0 }]]
  },
  'Fetch Projects': {
    main: [[{ node: 'Fetch Time Entries', type: 'main', index: 0 }]]
  },
  'Fetch Time Entries': {
    main: [[{ node: 'Evaluate Entries', type: 'main', index: 0 }]]
  },
  'Evaluate Entries': {
    main: [[{ node: 'Build Slack Messages', type: 'main', index: 0 }]]
  },
  'Build Slack Messages': {
    main: [[{ node: 'Post to Slack API', type: 'main', index: 0 }]]
  },
};

async function main() {
  console.log('Fetching current workflow...');
  const current = await apiCall('GET', `/api/v1/workflows/${workflowId}`);
  console.log('Current workflow:', current.name, '- nodes:', current.nodes.length);

  console.log('Updating workflow with v2 evaluator...');
  const updated = await apiCall('PUT', `/api/v1/workflows/${workflowId}`, {
    name: 'Harvest Time Entry Evaluator',
    nodes,
    connections,
    settings: { executionOrder: 'v1' },
  });

  console.log('Updated! Nodes:', updated.nodes.length);
  console.log('Node names:', updated.nodes.map(n => n.name).join(', '));

  // Activate
  console.log('Activating...');
  try {
    await apiCall('POST', `/api/v1/workflows/${workflowId}/activate`);
    console.log('Activated');
  } catch (e) {
    console.log('Activate note:', e.message.slice(0, 200));
  }
}

main().catch(e => console.error('Error:', e.message));
