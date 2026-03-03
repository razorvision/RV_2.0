import https from 'https';

const n8nKey = process.env.N8N_API_KEY_WORK;
const SHEET_ID = '1WfX-Yy61Jb1PRKXVs3TG6lFmFc0mkBYIF9TZbv1RTY0';
const GSHEETS_CRED_ID = 'DXbFUOqwi025RtyQ';

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
          reject(new Error(res.statusCode + ': ' + body.slice(0, 500)));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function makeHttpNode(id, name, position, url, jsonBody, onError) {
  const node = {
    id,
    name,
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position,
    credentials: {
      googleSheetsOAuth2Api: {
        id: GSHEETS_CRED_ID,
        name: 'Google Sheets account'
      }
    },
    parameters: {
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleSheetsOAuth2Api',
      url,
      method: 'POST',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody,
      options: {}
    }
  };
  if (onError) node.onError = onError;
  return node;
}

async function main() {
  // Step 1: Create all 6 tabs via Google Sheets batchUpdate API
  const createTabsBody = JSON.stringify({
    requests: [
      { addSheet: { properties: { title: 'Clients' } } },
      { addSheet: { properties: { title: 'Projects' } } },
      { addSheet: { properties: { title: 'Team Members' } } },
      { addSheet: { properties: { title: 'Ignore Patterns' } } },
      { addSheet: { properties: { title: 'Review Log' } } },
      { addSheet: { properties: { title: 'Settings' } } },
    ]
  });

  // Step 2: Write headers + data to all 6 tabs in one batch
  const writeDataBody = JSON.stringify({
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'Clients!A1',
        values: [
          ['client_name', 'client_id', 'tag_keywords', 'tag', 'expect_billable'],
          ['Essential Lending', '6663249', 'seo,ppc,ad campaign,social media,content strategy,brand', '[marketing]', 'TRUE'],
          ['Essential Lending', '6663249', 'server,hosting,devops,ci/cd,pipeline,deployment', '[infrastructure]', 'TRUE'],
        ]
      },
      {
        range: 'Projects!A1',
        values: [
          ['client_name', 'project_id', 'project_name', 'purpose', 'monthly_budget_hours', 'notes'],
          ['Essential Lending', '47258553', 'IPQS Integration', 'Feature - new integration build', '', ''],
          ['Essential Lending', '47258538', 'NeuroID Integration', 'Feature - new integration build', '', ''],
          ['Essential Lending', '47051950', 'Mobile Message Visibility Improvement', 'Feature', '', ''],
          ['Essential Lending', '45661048', 'Production Support Retention', 'Maintenance - ongoing retention', '', ''],
          ['Essential Lending', '45580562', 'Production Support', 'Maintenance - bug fixes and support', '', ''],
          ['Essential Lending', '31704041', 'Wiseloan Ninja Pod Support', 'Maintenance - pod support', '', ''],
        ]
      },
      {
        range: "'Team Members'!A1",
        values: [
          ['person', 'expected_tasks'],
          ['Andrew Tucker', 'Project Management'],
          ['Claire Brandon', 'Business Development'],
          ['David Bagley', 'Project Oversight'],
          ['Diego Tolentino', 'Development'],
          ['Luciana Oliveira', 'Development,Dev Prep'],
          ['Juan Antonio Arce', 'Quality Assurance'],
          ['Daniel Hedrick', 'Project Management,Lead Software Engineer'],
        ]
      },
      {
        range: "'Ignore Patterns'!A1",
        values: [
          ['keyword', 'client', 'added_by', 'added_date', 'flag_type'],
        ]
      },
      {
        range: "'Review Log'!A1",
        values: [
          ['date', 'reviewer', 'action', 'entry_id', 'flag_type', 'details'],
        ]
      },
      {
        range: 'Settings!A1',
        values: [
          ['setting', 'value'],
          ['min_description_length', '5'],
          ['vague_words', 'meeting,work,misc,general,tasks,stuff,various'],
          ['slack_channel', '#harvest-review'],
          ['post_delay_ms', '1500'],
        ]
      },
    ]
  });

  const workflow = {
    name: '[TEMP] Populate Harvest Evaluator Sheet',
    nodes: [
      {
        id: 'trigger',
        name: 'Webhook Trigger',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [0, 300],
        webhookId: 'populate-sheet-temp',
        parameters: {
          path: 'populate-sheet-temp',
          httpMethod: 'POST',
          responseMode: 'lastNode',
          options: {}
        }
      },
      // Create all 6 tabs (continueRegularOutput if some already exist)
      makeHttpNode(
        'create-tabs',
        'Create Tabs',
        [260, 300],
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
        createTabsBody,
        'continueRegularOutput'
      ),
      // Write headers + seed data to all tabs
      makeHttpNode(
        'write-data',
        'Write All Data',
        [520, 300],
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
        writeDataBody
      ),
    ],
    connections: {
      'Webhook Trigger': { main: [[{ node: 'Create Tabs', type: 'main', index: 0 }]] },
      'Create Tabs': { main: [[{ node: 'Write All Data', type: 'main', index: 0 }]] },
    },
    settings: { executionOrder: 'v1' }
  };

  console.log('Creating temp workflow...');
  const created = await apiCall('POST', '/api/v1/workflows', workflow);
  console.log('Created:', created.id, created.name);

  // Activate workflow so the webhook is registered
  console.log('Activating...');
  await apiCall('POST', `/api/v1/workflows/${created.id}/activate`);
  console.log('Activated');

  // Trigger via webhook
  console.log('Triggering via webhook...');
  const webhookResult = await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'work-n8n.tuckercorp.org',
      path: '/webhook/populate-sheet-temp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        console.log('Webhook response status:', res.statusCode);
        resolve({ status: res.statusCode, body: body.slice(0, 500) });
      });
    });
    req.on('error', reject);
    req.write('{}');
    req.end();
  });
  console.log('Webhook response:', webhookResult.body);

  // Check execution
  await new Promise(r => setTimeout(r, 3000));
  const execList = await apiCall('GET', `/api/v1/executions?workflowId=${created.id}&limit=1`);
  const latest = (execList.data || [])[0];
  if (latest) {
    console.log('Execution status:', latest.status, 'finished:', latest.finished);
    if (latest.status === 'error') {
      try {
        const detail = await apiCall('GET', `/api/v1/executions/${latest.id}`);
        const lastNode = detail.data?.resultData?.lastNodeExecuted;
        const runData = detail.data?.resultData?.runData;
        if (lastNode && runData?.[lastNode]) {
          const nodeResult = runData[lastNode][0];
          if (nodeResult.error) {
            console.log('Failed at node:', lastNode);
            console.log('Error:', nodeResult.error.message?.slice(0, 500));
          }
        }
      } catch (_) {}
    }
  } else {
    console.log('No execution found yet');
  }

  // Clean up
  console.log('Cleaning up temp workflow...');
  try {
    await apiCall('DELETE', `/api/v1/workflows/${created.id}`);
    console.log('Temp workflow deleted');
  } catch (e) {
    console.log('Cleanup note:', e.message);
  }
}

main().catch(e => console.error('Error:', e.message));
