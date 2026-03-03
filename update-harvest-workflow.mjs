import https from 'https';

const n8nKey = process.env.N8N_API_KEY_WORK;
const workflowId = '1BpEDRKZ6khUIpBX';

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
          reject(new Error(`${res.statusCode}: ${body.slice(0, 300)}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const current = await apiCall('GET', `/api/v1/workflows/${workflowId}`);
  console.log('Current workflow has', current.nodes.length, 'nodes');

  // Replace "Fetch Time Entries" code node back to HTTP Request with per_page=2000
  const fetchIdx = current.nodes.findIndex(n => n.name === 'Fetch Time Entries');
  if (fetchIdx === -1) {
    console.log('ERROR: Could not find "Fetch Time Entries" node');
    process.exit(1);
  }

  current.nodes[fetchIdx] = {
    id: current.nodes[fetchIdx].id,
    name: "Fetch Time Entries",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [980, 300],
    parameters: {
      url: "=https://api.harvestapp.com/v2/time_entries?client_id={{ $node['Loop Clients'].json.clientId }}&from={{ $node['Loop Clients'].json.dateRange.from }}&to={{ $node['Loop Clients'].json.dateRange.to }}&per_page=2000",
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
  };

  const updated = await apiCall('PUT', `/api/v1/workflows/${workflowId}`, {
    name: current.name,
    nodes: current.nodes,
    connections: current.connections,
    settings: current.settings,
  });

  console.log('Workflow updated! Nodes:', updated.nodes.length);
}

main().catch(e => console.error('Error:', e.message));
