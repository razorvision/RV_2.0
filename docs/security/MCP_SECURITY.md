# MCP Security Guide

Comprehensive security guidelines for using Model Context Protocol (MCP) servers safely in your development workflow.

## Table of Contents

- [Overview](#overview)
- [Security Model](#security-model)
- [Risk Assessment](#risk-assessment)
- [Approval Process](#approval-process)
- [Configuration Scopes](#configuration-scopes)
- [Server Evaluation Checklist](#server-evaluation-checklist)
- [Enterprise Governance](#enterprise-governance)
- [Best Practices](#best-practices)
- [Incident Response](#incident-response)
- [Additional Resources](#additional-resources)

## Overview

### What is MCP?

Model Context Protocol (MCP) enables Claude Code to connect to external tools and services through a standardized interface. While powerful, MCP servers run with your user privileges and require careful security consideration.

### Security Principles

1. **Least Privilege** - Grant only necessary permissions
2. **Trust but Verify** - Audit server code before approval
3. **Defense in Depth** - Layer security controls
4. **Transparency** - Understand what servers can access
5. **Accountability** - Track server usage and changes

### Key Security Concepts

- **Transport Layer** - How Claude Code communicates with servers (stdio, HTTP, SSE)
- **Execution Context** - Servers run with your OS user permissions
- **Configuration Scope** - Where server approvals are stored (local, project, user)
- **Environment Variables** - Dynamic configuration that may expose secrets

## Security Model

### Threat Model

**What MCP servers CAN access:**
- ✅ Files your user account can read/write
- ✅ Network requests to any URL
- ✅ Environment variables passed in configuration
- ✅ System commands via subprocess execution
- ✅ Browser automation and rendering (Playwright)
- ✅ Git repository operations
- ✅ Database connections (if credentials provided)

**What MCP servers CANNOT access (unless explicitly given):**
- ❌ Files outside your user permissions
- ❌ Root/Administrator operations
- ❌ Other user accounts
- ❌ System kernel or hardware directly

### Attack Vectors

**1. Malicious Server Code**
- **Risk**: Server performs unauthorized actions
- **Example**: Data exfiltration, file deletion, credential theft
- **Mitigation**: Only use servers from trusted sources, audit code

**2. Supply Chain Attacks**
- **Risk**: Legitimate server compromised via dependencies
- **Example**: npm package with malicious update
- **Mitigation**: Pin versions, audit dependencies, use lock files

**3. Configuration Injection**
- **Risk**: Malicious config exploits environment variables
- **Example**: `"command": "rm -rf /"` in `.mcp.json`
- **Mitigation**: Review config changes in PRs, validate JSON schema

**4. Credential Exposure**
- **Risk**: Secrets leaked through server logs or errors
- **Example**: API keys in environment variables exposed in error messages
- **Mitigation**: Use secret management, rotate credentials, audit logs

**5. Privilege Escalation**
- **Risk**: Server gains more permissions than intended
- **Example**: Server modifies shell configuration to run on startup
- **Mitigation**: Monitor file changes, use sandboxing where possible

## Risk Assessment

### Official Anthropic/MCP Organization Servers

**Risk Level: LOW**

Official servers from `@modelcontextprotocol/*` on npm:
- `@modelcontextprotocol/server-playwright`
- `@modelcontextprotocol/server-filesystem`
- `@modelcontextprotocol/server-git`
- `@modelcontextprotocol/server-memory`

**Why Low Risk:**
- Published by Model Context Protocol organization
- Open source and auditable
- Community reviewed
- Regular security updates
- Clear documentation

**Residual Risks:**
- Supply chain compromise (npm account takeover)
- Dependency vulnerabilities
- Misconfiguration by user

### Third-Party Servers

**Risk Level: MEDIUM to HIGH**

Community-developed or proprietary servers:
- Unknown code quality
- Varying security practices
- Potential backdoors or malicious code
- Unclear update/maintenance policies
- Limited community review

**Evaluation Required:**
- Source code audit
- Author reputation
- Community adoption
- Security disclosure policy
- Update frequency

### Custom/Internal Servers

**Risk Level: VARIES**

Servers developed by your organization:
- Risk depends on internal security practices
- Requires code review and testing
- Needs ongoing maintenance
- Should follow SDLC security requirements

## Approval Process

### Project-Scoped Approval (.mcp.json)

When you open a repository with an `.mcp.json` file, Claude Code prompts:

```
Project-scoped MCP servers detected:
- playwright
- filesystem
- git
- memory

Do you want to allow these servers? (yes/no)
```

**Before approving:**

1. **Review `.mcp.json` contents**
   ```bash
   cat .mcp.json
   ```

2. **Check each server configuration:**
   - Command being executed
   - Arguments passed
   - Environment variables
   - Transport type

3. **Verify server source:**
   ```bash
   # Check npm package details
   npm view @modelcontextprotocol/server-playwright

   # View package source on GitHub
   # https://github.com/modelcontextprotocol/servers
   ```

4. **Approve or deny:**
   - `yes` - Approve all servers
   - `no` - Reject all servers
   - Partial approval not supported (approve individually via CLI)

### User-Scoped Configuration (~/.claude/settings.json)

For permissions that apply across ALL projects:

```json
{
  "permissions": {
    "allow": ["Bash", "Read", "Write"],
    "deny": [],
    "ask": []
  }
}
```

**Security Implications:**
- Bypasses per-project approval
- Applies to every repository
- Can expose all projects to risk
- Use sparingly and audit regularly

### Local-Scoped Override (.claude/settings.local.json)

For machine-specific configurations:

```json
{
  "mcpServers": {
    "custom-tool": {
      "transport": "stdio",
      "command": "/usr/local/bin/custom-tool"
    }
  }
}
```

**Security Implications:**
- Not committed to version control
- Machine-specific trust decisions
- Can override project settings
- Useful for local development tools

## Configuration Scopes

### Precedence Order

1. **Local** (`.claude/settings.local.json`) - Highest precedence
2. **Project** (`.mcp.json`) - Middle precedence
3. **User** (`~/.claude/settings.json`) - Lowest precedence

### When to Use Each Scope

| Scope | Use Case | Security Consideration |
|-------|----------|----------------------|
| **Local** | Machine-specific tools, local database servers | Never commit to git |
| **Project** | Team-shared servers for project workflow | Review in every PR |
| **User** | Personal preferences across all repos | Broad permissions risk |

### Configuration Validation

Before committing `.mcp.json`:

```bash
# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('.mcp.json')))"

# Check for common issues
grep -i "password\|secret\|key" .mcp.json  # Should return nothing
```

## Server Evaluation Checklist

Use this checklist before approving any MCP server:

### ☐ Source Verification

- [ ] Server is from official MCP organization OR
- [ ] Source code is publicly available and auditable
- [ ] Repository has clear ownership and contact info
- [ ] Author/organization has established reputation

### ☐ Code Quality

- [ ] Source code reviewed for malicious behavior
- [ ] Dependencies audited (npm audit, Snyk, etc.)
- [ ] No obvious security vulnerabilities
- [ ] Follows secure coding practices

### ☐ Permissions Assessment

- [ ] Understand what files server can access
- [ ] Understand what network requests server makes
- [ ] Understand what system commands server executes
- [ ] Permissions align with server's stated purpose

### ☐ Configuration Security

- [ ] No hardcoded credentials in .mcp.json
- [ ] Environment variables properly scoped
- [ ] Command paths are absolute or from trusted locations
- [ ] Arguments don't contain injection risks

### ☐ Maintenance & Support

- [ ] Server is actively maintained
- [ ] Recent commits or releases
- [ ] Security disclosure policy exists
- [ ] Known vulnerabilities are patched

### ☐ Community Trust

- [ ] Server has community adoption
- [ ] Positive reviews or recommendations
- [ ] No reported security incidents
- [ ] Transparent development process

### ☐ Testing

- [ ] Test server in isolated environment first
- [ ] Verify server behaves as documented
- [ ] Monitor logs for unexpected behavior
- [ ] Check network traffic if applicable

## Enterprise Governance

### For Organizations

**Policy Framework:**

1. **Approved Server Registry**
   - Maintain list of vetted MCP servers
   - Document approval process
   - Set up internal mirror/cache for npm packages
   - Require security review for new servers

2. **Configuration Management**
   - Template `.mcp.json` for common use cases
   - Version control all MCP configurations
   - Automated scanning for violations
   - Audit trail for configuration changes

3. **Access Control**
   - Limit who can approve servers
   - Role-based permissions for server types
   - Separation of duties for critical servers
   - Regular access reviews

4. **Monitoring & Logging**
   - Centralized logging of MCP server activity
   - Anomaly detection for unusual behavior
   - Incident response procedures
   - Regular security audits

### Configuration Template for Teams

```json
{
  "mcpServers": {
    "playwright": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright@1.2.3"],
      "env": {}
    },
    "filesystem": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@1.0.0", "${PROJECT_ROOT}"],
      "env": {
        "PROJECT_ROOT": "${PWD}"
      }
    }
  }
}
```

**Key Security Features:**
- Pinned versions (`@1.2.3`) prevent supply chain attacks
- No hardcoded credentials
- Scoped filesystem access (`${PROJECT_ROOT}`)
- Uses official npm packages

### Pull Request Review Guidelines

When reviewing `.mcp.json` changes:

**Required Checks:**
- [ ] Server source is approved (official or vetted)
- [ ] Version is pinned (not `latest` or `*`)
- [ ] No credentials in environment variables
- [ ] Command paths are safe
- [ ] Changes have business justification
- [ ] Security team notified (if required by policy)

**Red Flags:**
- ❌ Unknown npm packages
- ❌ HTTP transport to untrusted domains
- ❌ Wildcard version ranges
- ❌ Absolute paths to user directories
- ❌ Environment variables with names like PASSWORD, SECRET, TOKEN
- ❌ Unnecessary broad permissions

## Best Practices

### 1. Pin Server Versions

**❌ Bad - Unpinned version:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"]
    }
  }
}
```

**✅ Good - Pinned version:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright@1.2.3"]
    }
  }
}
```

### 2. Scope Filesystem Access

**❌ Bad - Unlimited access:**
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-filesystem", "/"]
  }
}
```

**✅ Good - Scoped to project:**
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-filesystem", "${PROJECT_ROOT}"],
    "env": {"PROJECT_ROOT": "${PWD}"}
  }
}
```

### 3. Never Commit Secrets

**❌ Bad - Hardcoded credentials:**
```json
{
  "database": {
    "env": {
      "DB_PASSWORD": "supersecret123"
    }
  }
}
```

**✅ Good - Reference external secrets:**
```json
{
  "database": {
    "env": {
      "DB_PASSWORD": "${DB_PASSWORD}"
    }
  }
}
```

Then set in shell:
```bash
export DB_PASSWORD="supersecret123"
```

### 4. Use Allowlists

Configure Claude Code to only allow specific tools:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Bash(git *)",
      "Bash(npm *)"
    ],
    "deny": [
      "Bash(rm *)",
      "Bash(curl *)"
    ]
  }
}
```

### 5. Regular Security Audits

**Monthly:**
- Review approved MCP servers
- Check for server updates
- Audit configuration changes
- Review access logs

**Quarterly:**
- Full dependency audit
- Penetration testing
- Policy review and updates
- Team security training

### 6. Incident Response Plan

**If you suspect a compromised MCP server:**

1. **Immediate Actions:**
   ```bash
   # Stop Claude Code
   # Kill all MCP server processes
   ps aux | grep mcp
   kill <pid>

   # Remove server approval
   claude mcp remove <server-name>
   ```

2. **Investigation:**
   - Check recent file modifications: `find . -mtime -1`
   - Review bash history: `history`
   - Check network connections: `netstat -an`
   - Audit git commits: `git log --since="1 day ago"`

3. **Remediation:**
   - Rotate credentials
   - Review and restore affected files
   - Update security policies
   - Report to security team

4. **Prevention:**
   - Update server to patched version
   - Strengthen approval process
   - Document incident and lessons learned

## Best Practices

### Developer Responsibilities

1. **Before Approving Servers:**
   - Read server documentation
   - Review source code (for third-party servers)
   - Understand permissions required
   - Check for security advisories

2. **During Development:**
   - Monitor server behavior
   - Report unexpected actions
   - Keep servers updated
   - Use least privilege principle

3. **Code Review:**
   - Review `.mcp.json` changes carefully
   - Question new servers or permission changes
   - Ensure changes are documented
   - Follow team approval process

### Team Lead Responsibilities

1. **Governance:**
   - Establish MCP usage policies
   - Maintain approved server list
   - Conduct security training
   - Regular audits and reviews

2. **Configuration Management:**
   - Provide secure templates
   - Review all config changes
   - Enforce version pinning
   - Document decisions

3. **Incident Response:**
   - Establish reporting procedures
   - Maintain incident response plan
   - Coordinate with security team
   - Post-incident reviews

## Incident Response

### Response Phases

#### 1. Detection
- Monitor for unusual behavior
- Watch for permission escalation
- Check for unexpected network traffic
- Review error logs

#### 2. Containment
```bash
# Stop Claude Code immediately
# Disconnect network if needed
# Kill MCP processes
pkill -f "modelcontextprotocol"

# Revoke server approvals
claude mcp reset-project-choices
```

#### 3. Investigation
```bash
# Check recent file changes
find . -type f -mtime -1 -ls

# Review git changes
git status
git diff HEAD

# Check command history
history | tail -100

# Review MCP logs (location varies by OS)
# Mac/Linux: ~/.claude/logs/
# Windows: %APPDATA%\claude\logs\
```

#### 4. Recovery
- Restore affected files from backup
- Rotate compromised credentials
- Update to patched server versions
- Apply additional security controls

#### 5. Post-Incident
- Document what happened
- Update security policies
- Train team on lessons learned
- Improve detection mechanisms

### Reporting Security Issues

**For Official MCP Servers:**
- Report to Model Context Protocol Security initiative
- GitHub: https://github.com/ModelContextProtocol-Security
- Follow coordinated disclosure

**For Third-Party Servers:**
- Contact server maintainer
- Check for security.txt or SECURITY.md
- Consider public disclosure if no response

**For Internal Incidents:**
- Follow organization's incident response policy
- Notify security team
- Document timeline and impact
- Coordinate remediation

## Additional Resources

### Documentation
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Claude Code Documentation](https://code.claude.com/docs)
- [MCP Security Initiative](https://github.com/ModelContextProtocol-Security/modelcontextprotocol-security.io)

### Security Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Controls](https://www.cisecurity.org/controls)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Check for vulnerabilities
- [Snyk](https://snyk.io/) - Dependency scanning
- [Socket Security](https://socket.dev/) - Supply chain protection
- [Dependabot](https://github.com/dependabot) - Automated dependency updates

### Community
- [MCP GitHub Discussions](https://github.com/orgs/modelcontextprotocol/discussions)
- [Claude Code GitHub Issues](https://github.com/anthropics/claude-code/issues)

## Checklist Summary

**Before Using MCP Servers:**
- [ ] Read this security guide
- [ ] Establish approval process
- [ ] Configure appropriate scopes
- [ ] Pin server versions
- [ ] Review server source code (for third-party)
- [ ] Set up monitoring
- [ ] Document decisions

**Regular Maintenance:**
- [ ] Update servers monthly
- [ ] Audit configurations quarterly
- [ ] Review access logs
- [ ] Test incident response procedures
- [ ] Security training for team

**For Each New Server:**
- [ ] Complete evaluation checklist
- [ ] Get security approval (if required)
- [ ] Pin specific version
- [ ] Document purpose and risks
- [ ] Test in isolation first
- [ ] Monitor after deployment

## Conclusion

MCP servers are powerful tools that enhance Claude Code's capabilities, but they require careful security consideration. By following this guide, you can:

1. **Understand the risks** - Know what servers can access
2. **Make informed decisions** - Evaluate servers before approval
3. **Implement controls** - Use appropriate configuration scopes
4. **Monitor activity** - Detect and respond to incidents
5. **Maintain security** - Regular updates and audits

**Key Takeaways:**
- ✅ Only use servers from trusted sources
- ✅ Pin versions to prevent supply chain attacks
- ✅ Never commit credentials to version control
- ✅ Review all `.mcp.json` changes in pull requests
- ✅ Monitor server behavior and logs
- ✅ Have an incident response plan

**Remember:** Security is a shared responsibility. Stay vigilant, follow best practices, and report concerns promptly.

---

**Last Updated:** 2025-11-21
**Maintained By:** Security & Development Teams
**Version:** 1.0.0

**Questions or Concerns?**
- Open an issue in this repository
- Contact your security team
- Review [MCP Security Initiative](https://github.com/ModelContextProtocol-Security/modelcontextprotocol-security.io)
