---
title: Incident Response Guide
parent: Infrastructure
grand_parent: Guides
---
# Incident Response Guide

Procedures for handling production incidents, from initial detection through resolution and post-mortem.

## Table of Contents

- [Severity Levels](#severity-levels)
- [Response Process](#response-process)
- [Communication](#communication)
- [Rollback Procedures](#rollback-procedures)
- [Post-Mortem](#post-mortem)
- [On-Call Responsibilities](#on-call-responsibilities)

## Severity Levels

### Severity Definitions

| Level | Name | Description | Response Time | Examples |
|-------|------|-------------|---------------|----------|
| **SEV1** | Critical | Complete service outage, data loss risk | Immediate (15 min) | Site down, database corruption, security breach |
| **SEV2** | Major | Significant functionality broken | 30 minutes | Auth broken, payments failing, major feature down |
| **SEV3** | Minor | Degraded experience, workaround exists | 4 hours | Slow performance, minor feature broken |
| **SEV4** | Low | Cosmetic issues, no impact on functionality | Next business day | UI glitches, typos |

### Escalation Matrix

| Severity | Primary Responder | Escalate To | Executive Notify |
|----------|-------------------|-------------|------------------|
| SEV1 | On-call engineer | Team lead + All available engineers | Yes |
| SEV2 | On-call engineer | Team lead | If > 1 hour |
| SEV3 | Assigned engineer | On-call if needed | No |
| SEV4 | Assigned engineer | None | No |

## Response Process

### 1. Detection & Triage (0-5 minutes)

```
┌─────────────────────────────────────────────────────────┐
│ INCIDENT DETECTED                                        │
│ Source: Monitoring alert / User report / Team observation│
├─────────────────────────────────────────────────────────┤
│ 1. Acknowledge the alert                                 │
│ 2. Verify the issue is real (not false positive)        │
│ 3. Assess severity level                                 │
│ 4. Create incident channel (if SEV1/SEV2)               │
└─────────────────────────────────────────────────────────┘
```

**Quick Assessment Questions:**
- Is the service completely down or partially degraded?
- How many users are affected?
- Is there data loss or security risk?
- Is there a known workaround?

### 2. Incident Declaration (5-10 minutes)

For SEV1/SEV2 incidents:

1. **Create incident channel**: `#incident-YYYY-MM-DD-brief-description`
2. **Post initial summary**:

```
🚨 INCIDENT DECLARED

Severity: SEV1/SEV2
Summary: [Brief description of the issue]
Impact: [Who/what is affected]
Detection: [How was it discovered]
Status: Investigating

Incident Commander: @name
```

3. **Assign roles**:
   - **Incident Commander (IC)**: Coordinates response, makes decisions
   - **Technical Lead**: Investigates and implements fixes
   - **Communications Lead**: Updates stakeholders

### 3. Investigation (10-30 minutes)

**Diagnostic Checklist:**

```bash
# Check deployment history
vercel ls --limit 5

# Check error logs
# Vercel: Dashboard → Logs
# Or your logging service (Datadog, etc.)

# Check health endpoints
curl https://your-app.com/api/health

# Check database connectivity
# Via your database dashboard or CLI

# Check external service status
# Third-party status pages (Stripe, Auth0, etc.)
```

**Common Issues to Check:**
- [ ] Recent deployment?
- [ ] Database connection issues?
- [ ] Third-party service outage?
- [ ] SSL certificate expiration?
- [ ] DNS issues?
- [ ] Rate limiting triggered?
- [ ] Resource exhaustion (memory, connections)?

### 4. Mitigation (30-60 minutes)

**Priority Order:**
1. **Restore service** - Rollback, failover, or hotfix
2. **Prevent further damage** - Rate limit, disable feature
3. **Fix root cause** - Can wait until service is stable

### 5. Resolution & Closure

```
✅ INCIDENT RESOLVED

Duration: [X hours Y minutes]
Resolution: [What fixed it]
Root Cause: [Brief explanation]
Follow-up: [Any remaining work]

Post-mortem scheduled: [Date/Time]
```

## Communication

### Internal Communication

**During Incident:**
- All updates go to incident channel
- Update every 15-30 minutes, even if no change
- Use clear, factual language

**Update Template:**
```
⏱️ UPDATE [HH:MM]

Status: [Investigating / Identified / Mitigating / Resolved]
Current State: [What's happening now]
Next Steps: [What we're trying next]
ETA: [If known]
```

### External Communication (Status Page)

**Initial Post:**
```
Investigating: We are investigating reports of [issue description].
Some users may experience [impact]. We will provide updates as we learn more.
```

**Update:**
```
Identified: We have identified the cause of [issue].
We are implementing a fix. [Workaround if applicable].
```

**Resolution:**
```
Resolved: The issue affecting [service/feature] has been resolved.
[Brief explanation]. We apologize for any inconvenience.
```

### Stakeholder Notification

| Audience | When to Notify | Channel |
|----------|----------------|---------|
| Engineering Team | Immediately for SEV1/2 | Slack |
| Product/Support | Within 15 min for SEV1/2 | Slack |
| Executives | SEV1 only, or SEV2 > 1 hour | Slack/Email |
| Customers | If customer-facing impact | Status page |

## Rollback Procedures

### Application Rollback (Vercel)

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]

# Verify
curl https://your-app.com/api/health
```

### Database Rollback

**Option 1: Revert Migration**
```bash
# Roll back last migration
npx prisma migrate resolve --rolled-back "migration_name"

# Check migration status
npx prisma migrate status
```

**Option 2: Point-in-Time Recovery**
- Use your database provider's backup/restore feature
- Neon: Time Travel (up to 7 days)
- AWS RDS: Point-in-time restore

### Feature Flag Disable

If using feature flags:
```typescript
// Disable problematic feature immediately
await featureFlags.disable('new-checkout-flow');
```

### Emergency Procedures

**If unable to rollback normally:**

1. **DNS Failover**: Point to maintenance page
2. **Scale to Zero**: Temporarily remove all instances
3. **Database Disconnect**: Revoke app credentials if data at risk

## Post-Mortem

### Timeline: Within 48-72 Hours

### Post-Mortem Template

```markdown
# Incident Post-Mortem: [Title]

**Date**: [Date of incident]
**Duration**: [Start time] - [End time] ([X] hours [Y] minutes)
**Severity**: SEV[X]
**Author**: [Name]

## Summary
[2-3 sentence summary of what happened and impact]

## Impact
- Users affected: [Number/percentage]
- Revenue impact: [If applicable]
- Data impact: [Any data loss/corruption]

## Timeline (All times in [timezone])
| Time | Event |
|------|-------|
| HH:MM | [Event description] |
| HH:MM | [Event description] |

## Root Cause
[Detailed explanation of what caused the incident]

## Resolution
[What was done to resolve the incident]

## What Went Well
- [Point 1]
- [Point 2]

## What Went Poorly
- [Point 1]
- [Point 2]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action description] | @name | YYYY-MM-DD | Open |

## Lessons Learned
[Key takeaways and how to prevent similar incidents]
```

### Post-Mortem Meeting

**Agenda (30-60 minutes):**
1. Timeline review (10 min)
2. Root cause discussion (15 min)
3. What went well/poorly (10 min)
4. Action item assignment (10 min)
5. Questions (5 min)

**Rules:**
- Blameless - Focus on systems, not people
- Factual - Stick to what happened, not assumptions
- Actionable - Every problem needs a concrete action item

## On-Call Responsibilities

### Before Your Shift

- [ ] Laptop charged and accessible
- [ ] VPN configured and tested
- [ ] Access to monitoring dashboards verified
- [ ] Escalation contacts saved
- [ ] Runbooks bookmarked

### During Your Shift

- [ ] Monitor alert channels
- [ ] Acknowledge alerts within 5 minutes
- [ ] Document any incidents or near-misses
- [ ] Hand off open issues to next on-call

### On-Call Tools

| Purpose | Tool |
|---------|------|
| Alert management | PagerDuty / Opsgenie |
| Monitoring | Vercel Analytics / Datadog |
| Logging | Vercel Logs / Datadog |
| Communication | Slack |
| Status page | Statuspage.io / Instatus |

### Handoff Checklist

```
On-Call Handoff: [Date]

From: @name
To: @name

Open Issues:
- [Issue 1 description and status]
- [Issue 2 description and status]

Recent Incidents:
- [Date]: [Brief description] - Resolved

Things to Watch:
- [Any ongoing concerns]
```

## Related Resources

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Error Handling](../development/ERROR_HANDLING.md)
- Monitoring Dashboard: [Link]
- Status Page: [Link]
