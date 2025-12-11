# Troubleshooting Guide

When things go wrong, start here. This section provides step-by-step debugging guides, flowcharts, and solutions for common issues.

## Quick Problem Finder

**Choose the category that matches your issue:**

| Problem Category | Guide | Common Symptoms |
|------------------|-------|-----------------|
| **Authentication Issues** | [Auth Debugging](AUTH_DEBUGGING.md) | Login fails, sessions expire, 401 errors |
| **Database Problems** | [Database Issues](DATABASE_ISSUES.md) | Connection failures, slow queries, migration errors |
| **Deployment Failures** | [Deployment Debugging](DEPLOYMENT_FAILURES.md) | Build errors, CI/CD failures, deploy timeouts |
| **Build/Compilation Errors** | [Build Errors](BUILD_ERRORS.md) | TypeScript errors, missing modules, syntax errors |
| **Performance Issues** | [Performance Debugging](PERFORMANCE_DEBUGGING.md) | Slow pages, high CPU, memory leaks |
| **Environment Variables** | [Environment Config](ENVIRONMENT_VARIABLES.md) | Missing env vars, config not loading |
| **MCP Server Issues** | [MCP Troubleshooting](MCP_TROUBLESHOOTING.md) | MCP not connecting, permission errors |
| **General Questions** | [FAQ](FAQ.md) | "How do I...?", "Why is...?" |

---

## Emergency Checklist

When something breaks in production:

1. ☑️ **Check status pages** - Is it a service outage?
2. ☑️ **Check error logs** - What's the actual error message?
3. ☑️ **Check recent changes** - Was anything deployed recently?
4. ☑️ **Check environment** - Are environment variables set correctly?
5. ☑️ **Roll back if critical** - Revert to last known good state
6. ☑️ **Document the incident** - Record what happened and how you fixed it

**See:** [Incident Response Guide](../guides/infrastructure/INCIDENT_RESPONSE.md) for detailed procedures.

---

## Common "I'm Stuck" Scenarios

### "I can't log in to the app"
→ [Auth Debugging Guide](AUTH_DEBUGGING.md#login-failures)

### "Database connection refused"
→ [Database Issues Guide](DATABASE_ISSUES.md#connection-failures)

### "Build failing on CI but works locally"
→ [Build Errors Guide](BUILD_ERRORS.md#works-locally-fails-ci)

### "Page loads very slowly"
→ [Performance Debugging Guide](PERFORMANCE_DEBUGGING.md#slow-page-loads)

### "Environment variable not found"
→ [Environment Variables Guide](ENVIRONMENT_VARIABLES.md#missing-variables)

### "MCP server won't start"
→ [MCP Troubleshooting Guide](MCP_TROUBLESHOOTING.md#server-wont-start)

---

## Debugging Methodology

Use this systematic approach for any issue:

### 1. Reproduce the Issue
- Can you consistently reproduce it?
- Does it happen in dev/staging/production?
- Does it happen for all users or specific ones?

### 2. Gather Information
- **Error messages** - Full stack traces
- **Logs** - Application, database, server logs
- **Environment** - OS, browser, Node version
- **Recent changes** - Commits, deployments, config changes

### 3. Form a Hypothesis
- What do you think is causing the issue?
- What evidence supports this hypothesis?
- How can you test it?

### 4. Test Your Hypothesis
- Make one change at a time
- Document what you tried
- Verify if the issue is resolved

### 5. Fix and Document
- Apply the fix
- Write tests to prevent regression
- Document the solution

---

## Debugging Tools

### Built-in Tools
- **Browser DevTools** - Network, console, performance
- **Node.js Debugger** - `node --inspect`
- **React DevTools** - Component inspector
- **Database client** - pgAdmin, TablePlus

### CLI Tools
```bash
# Check logs
tail -f logs/app.log

# Monitor processes
htop

# Check network
curl -v http://localhost:3000

# Test database connection
psql -h localhost -U user -d database

# Check ports
lsof -i :3000
```

### MCP Tools
- **Playwright** - Browser automation for debugging UI
- **SQLite/PostgreSQL MCP** - Database queries
- **GitHub MCP** - Check recent changes

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Search the [FAQ](FAQ.md)
3. ✅ Review [Common Tasks](../COMMON_TASKS.md)
4. ✅ Check recent commits for related changes
5. ✅ Gather error messages and logs

### When Asking for Help

Provide this information:

```markdown
**Issue:** Brief description of the problem

**Environment:**
- OS: [Windows 11 / macOS 14 / Ubuntu 22.04]
- Node version: [v20.10.0]
- Browser: [Chrome 120]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Issue occurs

**Error Messages:**
[Paste full error message or stack trace]

**What I've Tried:**
- Tried X, result was Y
- Tried Z, result was W

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens
```

### Where to Ask
- **Team chat** - For quick questions
- **GitHub issues** - For bugs and feature requests
- **Code review** - For code-specific questions
- **Documentation** - Check guides first

---

## Prevention Best Practices

### Avoid Common Pitfalls

1. **Always use environment variables for config**
   - Never hardcode API keys, database URLs
   - Use `.env.example` as a template

2. **Test locally before pushing**
   - Run tests: `npm test`
   - Run linter: `npm run lint`
   - Build: `npm run build`

3. **Use type checking**
   - TypeScript catches many errors
   - Run `npm run typecheck` before committing

4. **Handle errors gracefully**
   - Always use try/catch for async operations
   - Provide meaningful error messages
   - Log errors for debugging

5. **Monitor in production**
   - Set up error tracking (Sentry, etc.)
   - Monitor performance (Vercel Analytics, etc.)
   - Set up alerts for critical issues

---

## Troubleshooting by Technology

### Next.js
- [Next.js Troubleshooting](../frameworks/NEXTJS_GUIDE.md#troubleshooting)
- [Common Next.js Issues](BUILD_ERRORS.md#nextjs-specific)

### Prisma
- [Prisma Troubleshooting](../frameworks/PRISMA_GUIDE.md#troubleshooting)
- [Database Issues](DATABASE_ISSUES.md#prisma-specific)

### NextAuth
- [NextAuth Troubleshooting](../frameworks/NEXTAUTH_GUIDE.md#troubleshooting)
- [Auth Debugging](AUTH_DEBUGGING.md)

### Deployment Platforms
- [Vercel Issues](DEPLOYMENT_FAILURES.md#vercel)
- [Railway Issues](DEPLOYMENT_FAILURES.md#railway)
- [Fly.io Issues](DEPLOYMENT_FAILURES.md#flyio)

---

## Quick Fixes for Common Issues

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 [PID]
```

### Clear Build Cache
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Reset Database
```bash
npx prisma db push --force-reset
npx prisma generate
npx prisma db seed
```

### Clear Git Issues
```bash
# Abort merge/rebase
git merge --abort
git rebase --abort

# Reset to origin
git fetch origin
git reset --hard origin/main
```

### MCP Server Reset
```bash
claude mcp reset-project-choices
```

---

## Detailed Guides

- **[Authentication Debugging](AUTH_DEBUGGING.md)** - Login, sessions, JWT issues
- **[Database Issues](DATABASE_ISSUES.md)** - Connections, queries, migrations
- **[Deployment Failures](DEPLOYMENT_FAILURES.md)** - CI/CD, build, deploy issues
- **[Build Errors](BUILD_ERRORS.md)** - TypeScript, compilation, module errors
- **[Performance Debugging](PERFORMANCE_DEBUGGING.md)** - Slow queries, memory leaks
- **[Environment Variables](ENVIRONMENT_VARIABLES.md)** - Config and env issues
- **[MCP Troubleshooting](MCP_TROUBLESHOOTING.md)** - MCP server problems
- **[FAQ](FAQ.md)** - Frequently asked questions

---

**Last Updated:** 2024-12-11
