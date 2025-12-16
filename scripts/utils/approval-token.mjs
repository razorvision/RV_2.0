import crypto from 'crypto';

/**
 * Generate a signed approval token for email links
 * Used by send-email.mjs to create secure approval URLs
 *
 * @param {string} runId - GitHub Actions run ID
 * @param {string} secret - HMAC secret (from APPROVAL_TOKEN_SECRET env var)
 * @returns {string} - Signed token
 */
export function generateApprovalToken(runId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(runId)
    .digest('hex');
}

/**
 * Build the full approval URL
 *
 * @param {string} runId - GitHub Actions run ID
 * @param {string} token - Signed approval token
 * @param {string} deploymentUrl - Vercel deployment URL (e.g., https://rv-2-0.vercel.app)
 * @returns {string} - Full approval URL
 */
export function buildApprovalUrl(runId, token, deploymentUrl) {
  return `${deploymentUrl}/api/approve?token=${token}&run_id=${runId}`;
}
