---
title: Visual Development Workflow
parent: Workflows
---
# Visual Development Workflow

This guide establishes a quality control workflow for UI changes. It ensures visual changes meet quality standards before being presented to stakeholders.

## Table of Contents

- [Why Self-Evaluate](#why-self-evaluate)
- [The Self-Evaluation Loop](#the-self-evaluation-loop)
- [Visual Quality Checklist](#visual-quality-checklist)
- [Using Playwright MCP for Screenshots](#using-playwright-mcp-for-screenshots)
- [When to Present to User](#when-to-present-to-user)
- [Common Visual Issues](#common-visual-issues)
- [Responsive Design Checks](#responsive-design-checks)

---

## Why Self-Evaluate

### The Problem

Visual bugs are embarrassing and erode trust:
- Misaligned elements look unprofessional
- Poor contrast makes apps inaccessible
- Broken layouts frustrate users
- These issues are easy to miss in code review

### The Solution

**Always verify your work visually before presenting it.**

This applies to:
- New components
- Style changes
- Layout modifications
- Responsive design work
- Any change that affects appearance

---

## The Self-Evaluation Loop

### Overview

```
┌─────────────────┐
│  Make Changes   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Take Screenshot │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     Issues Found
│ Evaluate Result │─────────────────┐
└────────┬────────┘                 │
         │                          │
         │ Looks Good               │
         ▼                          │
┌─────────────────┐                 │
│ Present to User │                 │
└─────────────────┘                 │
         ▲                          │
         │                          │
         └──────────────────────────┘
                  Fix & Repeat
```

### Step-by-Step Process

#### 1. Make Changes

Implement the visual change in code.

#### 2. Take Screenshot

Use Playwright MCP to capture the result:

```
Take a screenshot of the [component/page] at http://localhost:3000/path
```

#### 3. Evaluate Result

Critically assess the screenshot:

- Does it look good?
- Are there obvious issues?
- Does it match the design/expectation?
- Would you be proud to show this to a client?

#### 4. Iterate if Needed

If issues are found:

1. Note the specific problems
2. Fix them in code
3. Take another screenshot
4. Re-evaluate
5. Repeat until satisfied

#### 5. Present to User

Only after you're satisfied, present the result.

**Key Principle:** Don't rely on users to catch visual issues. Proactively identify and fix them yourself.

---

## Visual Quality Checklist

Use this checklist when evaluating visual changes:

### Spacing & Alignment

- [ ] **Consistent padding** - Same padding in similar contexts
- [ ] **Proper margins** - Elements don't touch inappropriately
- [ ] **Alignment** - Elements that should align actually do
- [ ] **Balance** - Layout feels balanced, not lopsided
- [ ] **Whitespace** - Enough breathing room, not cramped

### Typography

- [ ] **Font sizes** - Appropriate for context (headings vs body)
- [ ] **Line height** - Text is readable, not cramped
- [ ] **Font weight** - Bold used appropriately for emphasis
- [ ] **Truncation** - Long text handled gracefully
- [ ] **Hierarchy** - Clear visual hierarchy of text

### Colors & Contrast

- [ ] **Readability** - Text readable against background
- [ ] **WCAG compliance** - Meets AA contrast ratio (4.5:1 for text)
- [ ] **Consistent palette** - Colors match design system
- [ ] **Hover/active states** - Interactive elements have feedback
- [ ] **Dark mode** - Works if dark mode is supported

### Layout & Structure

- [ ] **Content fit** - Works with different content lengths
- [ ] **Overflow handling** - Long content doesn't break layout
- [ ] **Empty states** - Looks good with no data
- [ ] **Loading states** - Appropriate loading indicators
- [ ] **Error states** - Error messages display correctly

### Interactive Elements

- [ ] **Clickable areas** - Buttons/links have adequate hit targets
- [ ] **Focus states** - Visible focus for keyboard navigation
- [ ] **Disabled states** - Disabled elements look disabled
- [ ] **Loading states** - Buttons show loading when processing

### Polish

- [ ] **Icons** - Properly sized and aligned
- [ ] **Borders/shadows** - Consistent with design system
- [ ] **Animations** - Smooth, not jarring
- [ ] **Overall feel** - Would this look professional to end users?

---

## Using Playwright MCP for Screenshots

### Basic Screenshot

```
Navigate to http://localhost:3000/dashboard and take a screenshot
```

### Screenshot of Specific Element

```
Take a screenshot of the user profile card component
```

### Full Page Screenshot

```
Take a full-page screenshot of the settings page
```

### After Interaction

```
Click the dropdown menu, wait for it to open, then take a screenshot
```

### Multiple States

```
Take screenshots of the form in these states:
1. Empty (initial state)
2. With validation errors
3. Successfully submitted
```

### Best Practices

1. **Use browser_snapshot first** - Get accessibility tree for reliable interaction
2. **Wait for animations** - Don't screenshot during transitions
3. **Check multiple states** - Empty, loading, populated, error
4. **Test different data** - Short text, long text, edge cases
5. **Clean up screenshots** - Delete from `.playwright-mcp/` when done

---

## When to Present to User

### Ready to Present

- All items on visual checklist pass
- You've tested multiple states
- You're satisfied with the result
- No known visual issues

### Not Ready

- Obvious alignment issues
- Color contrast problems
- Broken layout on any viewport
- Missing states (loading, error, empty)
- You have reservations about quality

### How to Present

When presenting visual work:

1. **Share the screenshot** - Include it in your message
2. **Describe what was done** - Briefly explain the changes
3. **Note any trade-offs** - If you made design decisions
4. **Ask for feedback** - Invite input on the result

**Example:**

> I've implemented the user profile card. Here's a screenshot:
> 
> [screenshot]
> 
> The card includes the avatar, name, email, and edit button as discussed. I added a subtle shadow for depth. Let me know if you'd like any adjustments.

---

## Common Visual Issues

### Issue: Inconsistent Spacing

**Symptoms:**
- Different padding on similar elements
- Margins that don't match
- Uneven gutters

**Solutions:**
- Use spacing scale (4px, 8px, 16px, etc.)
- Create spacing constants
- Use consistent Tailwind classes

### Issue: Text Overflow

**Symptoms:**
- Text runs outside container
- Overlapping text
- Broken layouts with long words

**Solutions:**
- Add `overflow-hidden` with `text-ellipsis`
- Use `break-words` for long strings
- Set `max-width` on text containers

### Issue: Poor Contrast

**Symptoms:**
- Light text on light background
- Hard to read in certain lighting
- Fails accessibility checks

**Solutions:**
- Use contrast checker tool
- Stick to design system colors
- Test with color blindness simulators

### Issue: Broken Responsive Layout

**Symptoms:**
- Horizontal scroll on mobile
- Overlapping elements at breakpoints
- Content cut off

**Solutions:**
- Test at common breakpoints
- Use responsive utilities
- Check with browser DevTools

### Issue: Misaligned Elements

**Symptoms:**
- Icons not centered
- Text baseline issues
- Uneven button heights

**Solutions:**
- Use flexbox with `items-center`
- Check icon sizing and padding
- Use consistent height classes

---

## Responsive Design Checks

### Common Breakpoints

Test at these widths:

| Device | Width |
|--------|-------|
| Mobile (small) | 320px |
| Mobile (large) | 375px |
| Tablet | 768px |
| Desktop (small) | 1024px |
| Desktop (large) | 1280px |
| Desktop (wide) | 1536px |

### Testing with Playwright

```
Resize the browser to 375px width and take a screenshot of the homepage
```

```
Test the navigation menu at mobile, tablet, and desktop widths
```

### What to Check

**Mobile:**
- Navigation collapses to hamburger menu
- Touch targets are large enough (44x44px minimum)
- Text is readable without zooming
- No horizontal scroll

**Tablet:**
- Layout adapts appropriately
- Sidebars collapse or relocate
- Tables are scrollable or reformatted

**Desktop:**
- Content doesn't stretch too wide
- Whitespace is appropriate
- Multi-column layouts work

---

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Project guidelines
- [Claude Code Workflows](CLAUDE_CODE_WORKFLOWS.md) - Development patterns
- [MCP Setup](../integrations/MCP_SETUP.md) - Playwright configuration
- [MCP Troubleshooting](../integrations/MCP_TROUBLESHOOTING.md) - Common issues
- [Coding Standards](../guides/CODING_STANDARDS.md) - Code quality

---

**Last Updated:** 2024-12-08
**Maintained By:** Development Team
