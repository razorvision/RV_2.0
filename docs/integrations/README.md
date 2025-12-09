# Integrations

Guides for setting up external tools and services with this project.

---

## MCP (Model Context Protocol)

MCP servers extend Claude Code's capabilities with browser automation, GitHub integration, database access, and more.

### Quick Start (2 minutes)

1. Start Claude Code in your project: `claude`
2. Approve MCP servers when prompted: Type `yes`
3. Verify: `claude mcp list`

**That's it!** Most servers work without additional configuration.

### Reading Order

If you need more than the quick start, read these guides in order:

| Step | Guide | When to Read |
|------|-------|--------------|
| 1 | **[MCP Servers Guide](MCP_SERVERS_GUIDE.md)** | Start here - Quick setup for common servers |
| 2 | [MCP Setup](MCP_SETUP.md) | Deep dive into all 16 servers with full configuration |
| 3 | [MCP Security](../security/MCP_SECURITY.md) | Before adding sensitive servers (GitHub, Slack, etc.) |
| 4 | [MCP Troubleshooting](MCP_TROUBLESHOOTING.md) | When something isn't working |

### Servers by Setup Complexity

**No Setup Required:**
- Filesystem - File operations within your project
- Git - Git operations and repository management
- Memory - Persistent context across sessions
- Sequential Thinking - Enhanced reasoning
- SQLite - Local database operations
- Everything - System-wide file search (Windows)

**Minimal Setup (install browsers):**
- Playwright - `npx playwright install`
- Puppeteer - Chrome automation

**Requires API Keys:**

| Server | Required Variables | Where to Get |
|--------|-------------------|--------------|
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | [GitHub Settings](https://github.com/settings/tokens) |
| Slack | `SLACK_BOT_TOKEN`, `SLACK_TEAM_ID` | [Slack API](https://api.slack.com/apps) |
| Brave Search | `BRAVE_API_KEY` | [Brave API](https://brave.com/search/api/) (2K free/month) |
| PostgreSQL | `POSTGRES_CONNECTION_STRING` | Your database |
| Sentry | `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | [Sentry Settings](https://sentry.io/settings/) |
| AWS KB | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc. | AWS Console |

### Creating Custom MCP Servers

Need to build your own MCP server? We provide starter templates:

- **Node.js:** [.mcp-templates/nodejs/](../../.mcp-templates/nodejs/)
- **Python:** [.mcp-templates/python/](../../.mcp-templates/python/)

See [MCP Servers Guide](MCP_SERVERS_GUIDE.md#creating-custom-mcp-servers) for implementation details.

---

## Service Integrations

Step-by-step guides for integrating common third-party services.

### Payments

| Guide | Service | Use Case |
|-------|---------|----------|
| [Stripe Integration](STRIPE_INTEGRATION.md) | Stripe | Payments, subscriptions, checkout |

### Communication

| Guide | Service | Use Case |
|-------|---------|----------|
| [Email Integration](EMAIL_INTEGRATION.md) | Resend, SendGrid | Transactional email, templates |

### Storage

| Guide | Service | Use Case |
|-------|---------|----------|
| [File Upload Integration](FILE_UPLOAD_INTEGRATION.md) | UploadThing, S3 | File uploads, image storage |

### Analytics

| Guide | Service | Use Case |
|-------|---------|----------|
| [Analytics Integration](ANALYTICS_INTEGRATION.md) | PostHog, Plausible | User tracking, A/B testing |

---

## Other Integrations

- **GitHub Actions:** See [.github/workflows/](../../.github/workflows/)
- **Pre-commit Hooks:** See [pre-commit-hooks.md](../workflows/pre-commit-hooks.md)

---

## Related Documentation

- [Dev Environment Setup](../guides/DEV_ENVIRONMENT_SETUP.md) - Full development environment
- [Claude Code Configuration](../../.claude/README.md) - Permissions and settings
- [Security Policy](../security/SECURITY.md) - General security guidelines
