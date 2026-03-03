import https from 'https';

const n8nKey = process.env.N8N_API_KEY_WORK;
const harvestToken = process.argv[2]; // passed as arg

const workflow = {
  name: "Harvest Time Entry Evaluator",
  nodes: [
    {
      id: "webhook-trigger",
      name: "Webhook Trigger",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [0, 300],
      webhookId: "harvest-time-evaluator",
      parameters: {
        path: "harvest-time-evaluator",
        httpMethod: "POST",
        responseMode: "lastNode",
        options: {}
      }
    },
    {
      id: "schedule-trigger",
      name: "Monthly Schedule",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [0, 540],
      parameters: {
        rule: {
          interval: [
            {
              field: "cronExpression",
              expression: "0 8 1 * *"
            }
          ]
        }
      }
    },
    {
      id: "set-config",
      name: "Set Config",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [260, 300],
      parameters: {
        jsCode: `// Configuration - edit these values
const config = {
  harvestAccountId: '869362',
  harvestToken: '${harvestToken}',

  // Clients to evaluate (add more rows as needed)
  clients: [
    {
      name: 'Essential Lending',
      clientId: 6663249,
      tagKeywords: {
        'marketing': ['marketing', 'ad campaign', 'social media', 'seo', 'ppc', 'content strategy', 'brand'],
        'infrastructure': ['server', 'hosting', 'devops', 'ci/cd', 'pipeline', 'deployment'],
      },
      expectBillable: true,
    }
  ],

  vaguePatterns: [
    'meeting', 'work', 'support', 'misc', 'general',
    'tasks', 'stuff', 'various', 'updates', 'call',
    'email', 'review', 'testing'
  ],

  minDescriptionLength: 5,
};

// Calculate date range (previous month)
const now = new Date();
const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
const month = now.getMonth() === 0 ? 12 : now.getMonth();
const from = year + '-' + String(month).padStart(2, '0') + '-01';
const lastDay = new Date(year, month, 0).getDate();
const to = year + '-' + String(month).padStart(2, '0') + '-' + String(lastDay).padStart(2, '0');

return [{
  json: {
    ...config,
    dateRange: { from, to },
    monthLabel: year + '-' + String(month).padStart(2, '0'),
  }
}];`
      }
    },
    {
      id: "loop-clients",
      name: "Loop Clients",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [500, 300],
      parameters: {
        jsCode: `const config = $input.first().json;
const items = config.clients.map(client => ({
  json: {
    ...client,
    harvestAccountId: config.harvestAccountId,
    harvestToken: config.harvestToken,
    dateRange: config.dateRange,
    monthLabel: config.monthLabel,
    vaguePatterns: config.vaguePatterns,
    minDescriptionLength: config.minDescriptionLength,
  }
}));
return items;`
      }
    },
    {
      id: "fetch-projects",
      name: "Fetch Projects",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [740, 300],
      parameters: {
        url: "=https://api.harvestapp.com/v2/projects?client_id={{ $json.clientId }}&is_active=true&per_page=100",
        method: "GET",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "Authorization", value: "=Bearer {{ $json.harvestToken }}" },
            { name: "Harvest-Account-Id", value: "={{ $json.harvestAccountId }}" },
            { name: "User-Agent", value: "n8n-harvest-evaluator" }
          ]
        },
        options: {}
      }
    },
    {
      id: "fetch-entries",
      name: "Fetch Time Entries",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [980, 300],
      parameters: {
        url: "=https://api.harvestapp.com/v2/time_entries?client_id={{ $node['Loop Clients'].json.clientId }}&from={{ $node['Loop Clients'].json.dateRange.from }}&to={{ $node['Loop Clients'].json.dateRange.to }}&per_page=100",
        method: "GET",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "Authorization", value: "=Bearer {{ $node['Loop Clients'].json.harvestToken }}" },
            { name: "Harvest-Account-Id", value: "={{ $node['Loop Clients'].json.harvestAccountId }}" },
            { name: "User-Agent", value: "n8n-harvest-evaluator" }
          ]
        },
        options: {}
      }
    },
    {
      id: "evaluate-entries",
      name: "Evaluate Entries",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1220, 300],
      parameters: {
        jsCode: `const clientConfig = $node['Loop Clients'].json;
const projectsData = $node['Fetch Projects'].json;
const entriesData = $node['Fetch Time Entries'].json;

const projects = projectsData.projects || [];
const entries = entriesData.time_entries || [];
const flags = [];

// Build project lookup
const projectMap = {};
projects.forEach(p => { projectMap[p.id] = p; });

// Vague patterns
const vaguePatterns = (clientConfig.vaguePatterns || []).map(p => new RegExp('^' + p + '$', 'i'));
const minLen = clientConfig.minDescriptionLength || 5;

for (const entry of entries) {
  const notes = (entry.notes || '').trim();
  const project = projectMap[entry.project.id] || {};
  const entryBase = {
    entryId: entry.id,
    date: entry.spent_date,
    user: entry.user.name,
    project: entry.project.name,
    task: entry.task.name,
    hours: entry.hours,
    notes: notes,
    billable: entry.billable,
  };

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

  // CHECK 4: Tag check - keywords that should trigger tags
  if (clientConfig.tagKeywords) {
    for (const [tag, keywords] of Object.entries(clientConfig.tagKeywords)) {
      const bracketTag = '[' + tag + ']';
      const notesLower = notes.toLowerCase();
      const matchedKeyword = keywords.find(kw => notesLower.includes(kw.toLowerCase()));
      if (matchedKeyword && !notesLower.includes(bracketTag.toLowerCase())) {
        flags.push({
          ...entryBase,
          flagType: 'missing_tag',
          severity: 'high',
          message: 'Contains "' + matchedKeyword + '" but missing ' + bracketTag + ' tag',
          suggestedTag: bracketTag,
        });
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
};

flags.forEach(f => {
  summary.flagsByType[f.flagType] = (summary.flagsByType[f.flagType] || 0) + 1;
  summary.flagsBySeverity[f.severity]++;
});

return [{
  json: {
    summary,
    flags,
  }
}];`
      }
    },
    {
      id: "format-summary",
      name: "Format Summary",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1460, 300],
      parameters: {
        jsCode: `const { summary, flags } = $json;

let text = '== Harvest Time Entry Evaluation ==\\n';
text += 'Client: ' + summary.client + '\\n';
text += 'Period: ' + summary.month + '\\n';
text += 'Total Entries: ' + summary.totalEntries + '\\n';
text += 'Total Hours: ' + summary.totalHours.toFixed(2) + '\\n';
text += '---\\n';
text += 'Flags Found: ' + summary.totalFlags + '\\n';

if (summary.totalFlags > 0) {
  text += '\\nBy Type:\\n';
  for (const [type, count] of Object.entries(summary.flagsByType)) {
    text += '  ' + type + ': ' + count + '\\n';
  }
  text += '\\nBy Severity:\\n';
  text += '  High: ' + summary.flagsBySeverity.high + '\\n';
  text += '  Medium: ' + summary.flagsBySeverity.medium + '\\n';
  text += '  Low: ' + summary.flagsBySeverity.low + '\\n';

  text += '\\n== Flagged Entries ==\\n';
  flags.forEach((f, i) => {
    text += '\\n[' + (i+1) + '] ' + f.flagType.toUpperCase() + ' (' + f.severity + ')\\n';
    text += '    Date: ' + f.date + ' | User: ' + f.user + '\\n';
    text += '    Project: ' + f.project + ' | Task: ' + f.task + '\\n';
    text += '    Hours: ' + f.hours + ' | Notes: "' + (f.notes || '(empty)') + '"\\n';
    text += '    Issue: ' + f.message + '\\n';
  });
} else {
  text += '\\nNo issues found. All entries look good.\\n';
}

return [{
  json: {
    summary,
    flags,
    formattedReport: text,
  }
}];`
      }
    }
  ],
  connections: {
    "Webhook Trigger": {
      main: [[{ node: "Set Config", type: "main", index: 0 }]]
    },
    "Monthly Schedule": {
      main: [[{ node: "Set Config", type: "main", index: 0 }]]
    },
    "Set Config": {
      main: [[{ node: "Loop Clients", type: "main", index: 0 }]]
    },
    "Loop Clients": {
      main: [[{ node: "Fetch Projects", type: "main", index: 0 }]]
    },
    "Fetch Projects": {
      main: [[{ node: "Fetch Time Entries", type: "main", index: 0 }]]
    },
    "Fetch Time Entries": {
      main: [[{ node: "Evaluate Entries", type: "main", index: 0 }]]
    },
    "Evaluate Entries": {
      main: [[{ node: "Format Summary", type: "main", index: 0 }]]
    }
  },
  settings: {
    executionOrder: "v1"
  }
};

const data = JSON.stringify(workflow);
const options = {
  hostname: 'work-n8n.tuckercorp.org',
  path: '/api/v1/workflows',
  method: 'POST',
  headers: {
    'X-N8N-API-KEY': n8nKey,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200 || res.statusCode === 201) {
      const parsed = JSON.parse(body);
      console.log('Workflow created successfully!');
      console.log('  ID:', parsed.id);
      console.log('  Name:', parsed.name);
      console.log('  URL: https://work-n8n.tuckercorp.org/workflow/' + parsed.id);
    } else {
      console.log('Error response:', body.slice(0, 500));
    }
  });
});
req.on('error', e => console.log('Error:', e.message));
req.write(data);
req.end();
