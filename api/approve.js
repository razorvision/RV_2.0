import crypto from 'crypto';

/**
 * Vercel serverless function to handle email approval clicks
 * Triggered when user clicks "Approve & Send" button in approval email
 *
 * Usage: https://your-vercel-domain.vercel.app/api/approve?token=xyz&run_id=123
 */

export default async function handler(req, res) {
  // Only allow GET requests (from email links)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, run_id } = req.query;

  // Validate inputs
  if (!token || !run_id) {
    return res.status(400).json({ error: 'Missing token or run_id parameter' });
  }

  try {
    // Verify the token signature
    const tokenSecret = process.env.APPROVAL_TOKEN_SECRET;
    if (!tokenSecret) {
      throw new Error('APPROVAL_TOKEN_SECRET not configured');
    }

    const expectedToken = generateToken(run_id, tokenSecret);

    if (token !== expectedToken) {
      return res.status(401).json({ error: 'Invalid approval token' });
    }

    // Token is valid - trigger the GitHub workflow dispatch
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      throw new Error('GITHUB_TOKEN not configured');
    }

    const response = await fetch(
      'https://api.github.com/repos/razorvision/RV_2.0/actions/workflows/send-status-email.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: 'master',
          inputs: {
            action: 'send_to_all'
          }
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GitHub API error: ${response.status} ${errorBody}`);
      throw new Error(`GitHub API returned ${response.status}`);
    }

    // Return HTML response that looks good in email clients
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Approved</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #22c55e; margin: 0 0 10px 0; }
            p { color: #666; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Approval Confirmed!</h1>
            <p>Your status report has been approved and is now being sent to all recipients.</p>
            <p>You can close this page and return to Gmail.</p>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Approval error:', error);

    // Return error HTML response
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Approval Failed</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #ef4444; margin: 0 0 10px 0; }
            p { color: #666; line-height: 1.6; }
            .error { background: #fee2e2; border: 1px solid #fecaca; padding: 10px; border-radius: 4px; color: #7f1d1d; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Approval Failed</h1>
            <p>There was an error processing your approval. Please try again or contact support.</p>
            <div class="error">${error.message}</div>
          </div>
        </body>
      </html>
    `);
  }
}

/**
 * Generate a signed token for an approval link
 * This ensures only legitimate approval links work
 */
export function generateToken(runId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(runId)
    .digest('hex');
}
