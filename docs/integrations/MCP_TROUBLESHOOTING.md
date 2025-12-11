---
title: MCP Troubleshooting Guide
parent: Integrations
---
# MCP Troubleshooting Guide

This guide helps you prevent and recover from common issues with Model Context Protocol (MCP) servers, with a focus on browser automation tools.

## Table of Contents

- [Playwright Session Management](#playwright-session-management)
- [Tab Accumulation Prevention](#tab-accumulation-prevention)
- [Recovery Steps for Locked Sessions](#recovery-steps-for-locked-sessions)
- [Screenshot Cleanup Policy](#screenshot-cleanup-policy)
- [MCP Tools vs Test Runner](#mcp-tools-vs-test-runner)
- [Common Error Messages](#common-error-messages)
- [Platform-Specific Issues](#platform-specific-issues)
- [Other MCP Server Issues](#other-mcp-server-issues)

---

## Playwright Session Management

### How Playwright MCP Works

The Playwright MCP server uses a **persistent browser profile** by default. This means:

- Browser state persists between commands
- Tabs remain open until explicitly closed
- Login sessions and cookies persist
- **The browser profile can become locked** if not closed properly

### Best Practices

#### 1. Always Close When Done

```
When finished with browser automation, call browser_close
```

This releases the browser profile lock and cleans up resources.

#### 2. Check Session State Before Starting

```
Before starting browser automation, check existing session with browser_tabs (action: 'list')
```

This tells you if there's an existing session you can reuse.

#### 3. Reuse Existing Sessions

Instead of navigating to new pages repeatedly:

```
✅ Use browser_tabs with action: 'select' to switch to existing tabs
✅ Reuse the current tab for sequential navigation
❌ Don't call browser_navigate repeatedly without closing
```

#### 4. Close Tabs You're Done With

```
Use browser_tabs with action: 'close' to close tabs you no longer need
```

### Session Lifecycle

```
┌────────────────┐
│  Start Claude  │
│  Code Session  │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Check Existing │──── If exists ────► Reuse or Close
│ Session        │
└───────┬────────┘
        │ No session
        ▼
┌────────────────┐
│ browser_navigate│
│ (opens browser)│
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Do Work        │◄───────────┐
│ (click, type,  │            │
│  screenshot)   │            │
└───────┬────────┘            │
        │                     │
        │   More work?        │
        ├─────── Yes ─────────┘
        │
        │ No
        ▼
┌────────────────┐
│ browser_close  │
│ (releases lock)│
└────────────────┘
```

---

## Tab Accumulation Prevention

### The Problem

Every `browser_navigate` without closing can create new tabs. Over time:
- Memory usage increases
- Browser becomes slow
- Finding the right tab becomes difficult
- Session becomes unstable

### Prevention Strategies

#### Strategy 1: Reuse Current Tab

For sequential navigation:

```
1. browser_navigate to first URL
2. Do work
3. browser_navigate to second URL (reuses same tab)
4. Do work
5. browser_close when done
```

#### Strategy 2: Explicit Tab Management

For parallel work:

```
1. browser_tabs (action: 'new') - create new tab
2. browser_navigate - load content
3. Do work
4. browser_tabs (action: 'close') - close when done
5. Repeat for other tabs
```

#### Strategy 3: Clean Start Each Session

```
1. browser_close - ensure clean state
2. browser_navigate - fresh start
3. Do all work
4. browser_close - clean end
```

### Checking Tab Count

```
Use browser_tabs with action: 'list' to see all open tabs
```

If you see many tabs, consider closing unused ones before proceeding.

---

## Recovery Steps for Locked Sessions

### Symptoms of Locked Session

- Error: "Browser is already in use"
- Error: "Failed to launch browser"
- Error: "Protocol error"
- Browser commands hang indefinitely

### Recovery Procedure

#### Step 1: Try browser_close

```
Call browser_close - this often works even when other commands fail
```

#### Step 2: Manual Browser Closure

If browser_close fails, manually close browser windows:

**Windows:**
- Close all Chrome windows opened by Playwright
- Look for "Chrome" or "Chromium" in Task Manager
- End process if needed

**macOS:**
- Force Quit any Playwright Chrome instances
- Activity Monitor → Chrome/Chromium → Force Quit

**Linux:**
```bash
pkill -f chromium
pkill -f chrome
```

#### Step 3: Delete Profile Lock

If browser closure doesn't help, delete the profile lock:

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse "$env:LOCALAPPDATA\ms-playwright\mcp-chrome-*" -Force
```

**macOS/Linux:**
```bash
rm -rf ~/.cache/ms-playwright/mcp-chrome-*
```

#### Step 4: Restart Claude Code

If the MCP server itself is stuck:

1. Close Claude Code completely
2. Reopen Claude Code
3. MCP servers will restart fresh

### Prevention

To avoid locked sessions:

- Always call `browser_close` when done
- Don't close Claude Code while browser automation is running
- Handle errors gracefully (close browser on error)

---

## Screenshot Cleanup Policy

### Where Screenshots Go

Playwright MCP stores screenshots in:
```
.playwright-mcp/
```

This directory is typically in your project root or working directory.

### Cleanup Rules

1. **During Development:** Screenshots are temporary debugging aids
2. **After Issue Resolution:** Delete related screenshots
3. **Before Committing:** Check for accidental screenshot commits
4. **Regular Maintenance:** Periodically clean the directory

### Adding to .gitignore

Ensure screenshots aren't committed:

```gitignore
# Playwright MCP screenshots
.playwright-mcp/
*.png
*.jpg
!src/**/*.png
!public/**/*.png
```

### Automated Cleanup

Consider a cleanup script:

```bash
#!/bin/bash
# clean-playwright-screenshots.sh

if [ -d ".playwright-mcp" ]; then
  echo "Removing Playwright MCP screenshots..."
  rm -rf .playwright-mcp/*
  echo "Done."
else
  echo "No .playwright-mcp directory found."
fi
```

---

## MCP Tools vs Test Runner

### Understanding the Difference

| Aspect | MCP Playwright Tools | Playwright Test Runner |
|--------|---------------------|----------------------|
| **Purpose** | Ad-hoc browser automation | Formal test suite |
| **Command** | `mcp__playwright__*` | `npx playwright test` |
| **Use Case** | Quick checks, debugging | CI/CD, regression |
| **Persistence** | Interactive session | Fresh browser per test |
| **Output** | Screenshots, snapshots | Test reports, traces |

### When to Use MCP Tools

- Quick visual verification during development
- Interactive debugging
- Taking screenshots for documentation
- Testing a single interaction
- Exploring page structure

**Example:**
```
Navigate to localhost:3000 and take a screenshot of the new button
```

### When to Use Test Runner

- Automated regression testing
- CI/CD pipelines
- Testing multiple scenarios
- Cross-browser testing
- Generating test reports

**Example:**
```bash
npx playwright test auth.spec.ts
```

### They Work Together

Typical workflow:
1. **Develop feature** using MCP tools for quick feedback
2. **Write formal tests** using Playwright test runner
3. **Run test suite** in CI/CD
4. **Debug failures** using MCP tools if needed

---

## Common Error Messages

### "Browser is already in use"

**Cause:** Previous session wasn't closed properly.

**Solution:**
1. Call `browser_close`
2. If that fails, see [Recovery Steps](#recovery-steps-for-locked-sessions)

### "Failed to launch browser"

**Cause:** Browser binary missing or corrupted.

**Solution:**
```bash
npx playwright install
```

### "Protocol error" or "Target closed"

**Cause:** Browser crashed or was closed externally.

**Solution:**
1. Call `browser_close` to clean up
2. Start fresh with `browser_navigate`

### "Timeout waiting for element"

**Cause:** Element not found within timeout.

**Solution:**
1. Use `browser_snapshot` to see current page state
2. Verify element exists and is visible
3. Check if page finished loading
4. Increase timeout if needed

### "Element not visible" or "Element not interactable"

**Cause:** Element is hidden, covered, or off-screen.

**Solution:**
1. Use `browser_snapshot` to check element state
2. Scroll element into view
3. Wait for animations to complete
4. Check for overlapping elements

### "Navigation failed"

**Cause:** Network error, invalid URL, or server not running.

**Solution:**
1. Verify URL is correct
2. Check if dev server is running
3. Check network connectivity
4. Try the URL in a regular browser

### "Permission denied" (file operations)

**Cause:** File system permissions or file in use.

**Solution:**
1. Close applications using the file
2. Check file/folder permissions
3. Run with appropriate privileges

---

## Platform-Specific Issues

### Windows

#### Long Path Issues

**Symptom:** File path errors with deeply nested paths.

**Solution:**
```powershell
# Enable long paths (requires admin)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

#### Antivirus Blocking

**Symptom:** Browser fails to launch or is killed immediately.

**Solution:**
- Add Playwright browser directory to antivirus exclusions
- Location: `%LOCALAPPDATA%\ms-playwright`

#### WSL Considerations

**Symptom:** Browser doesn't display when running in WSL.

**Solution:**
- Use WSL2 with WSLg for GUI support
- Or run browser automation from Windows directly

### macOS

#### Gatekeeper Issues

**Symptom:** "Chromium can't be opened because it is from an unidentified developer"

**Solution:**
```bash
xattr -cr ~/.cache/ms-playwright
```

#### Permission Dialogs

**Symptom:** System prompts for screen recording/accessibility permissions.

**Solution:**
- Grant permissions in System Preferences → Security & Privacy
- May need to restart after granting permissions

### Linux

#### Missing Dependencies

**Symptom:** Browser fails to launch with library errors.

**Solution:**
```bash
# Install dependencies
npx playwright install-deps
```

#### Headless Mode Issues

**Symptom:** Browser works headless but not headed.

**Solution:**
- Ensure X11 or Wayland is running
- Use headless mode for servers without display:
  ```json
  {
    "playwright": {
      "headless": true
    }
  }
  ```

---

## Other MCP Server Issues

### GitHub MCP Server

**"Bad credentials" error:**
- Token expired or invalid
- Regenerate PAT and update environment variable

**"API rate limit exceeded":**
- Wait for rate limit reset
- Consider using a PAT with higher limits

### Memory MCP Server

**"Memory store corrupted":**
- Delete memory store file and restart
- Location varies by platform

### Filesystem MCP Server

**"Access denied":**
- Check that path is within allowed directories
- Verify file permissions

### General MCP Issues

**Server won't start:**
```bash
# Check if package is installed
npx -y @modelcontextprotocol/server-playwright --version

# Force reinstall
npm cache clean --force
npx -y @modelcontextprotocol/server-playwright
```

**Server status check:**
```
Use /mcp command in Claude Code to see server status
```

---

## Related Documentation

- [MCP Setup](MCP_SETUP.md) - Server configuration
- [Visual Development Workflow](../workflows/VISUAL_DEVELOPMENT_WORKFLOW.md) - Using screenshots
- [Claude Code Workflows](../workflows/CLAUDE_CODE_WORKFLOWS.md) - Development patterns
- [CLAUDE.md](../../CLAUDE.md) - Project guidelines

### External Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)

---

**Last Updated:** 2024-12-08
**Maintained By:** Development Team
