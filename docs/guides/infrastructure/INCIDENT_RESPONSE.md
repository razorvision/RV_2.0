# Incident Response Guide

Procedures for handling production incidents and outages.

## Table of Contents

- [Incident Severity Levels](#incident-severity-levels)
- [Response Workflow](#response-workflow)
- [Communication](#communication)
- [Common Incidents](#common-incidents)
- [Rollback Procedures](#rollback-procedures)
- [Post-Incident Review](#post-incident-review)

---

## Incident Severity Levels

| Level | Name | Description | Response Time | Examples |
|-------|------|-------------|---------------|----------|
| **P1** | Critical | Complete outage, data loss risk | Immediate (< 15 min) | Site down, security breach |
| **P2** | High | Major feature broken, many users affected | < 1 hour | Auth broken, payments failing |
| **P3** | Medium | Feature degraded, workaround exists | < 4 hours | Slow performance, minor bugs |
| **P4** | Low | Minor issue, few users affected | < 24 hours | UI glitches, edge cases |

---

## Response Workflow

### 1. Detection

**Sources of incident detection:**
- Automated monitoring alerts (Vercel, Sentry, UptimeRobot)
- User reports (support tickets, social media)
- Team member discovery
- Scheduled checks

### 2. Acknowledge

```
When you discover an incident:
1. Acknowledge in monitoring tool (if applicable)
2. Post in team channel: "Investigating [brief description]"
3. Assign yourself as incident lead
```

### 3. Assess

**Quick assessment checklist:**
- [ ] What is the impact? (users affected, revenue impact)
- [ ] When did it start?
- [ ] What changed recently? (deployments, config changes)
- [ ] Is it getting worse or stable?
- [ ] What's the severity level?

### 4. Communicate

**Internal communication:**
```
🚨 INCIDENT: [Brief Description]
Severity: P[1-4]
Status: Investigating / Identified / Fixing / Monitoring
Impact: [What's affected]
Lead: @[your-name]
Next update: [time]
```

**External communication (if needed):**
- Update status page
- Post on social media (for major incidents)
- Email affected users (for data issues)

### 5. Mitigate

**Immediate actions:**
1. **Rollback** - If recent deployment caused it
2. **Scale** - If capacity issue
3. **Disable** - Turn off broken feature
4. **Redirect** - Route traffic away from broken component

### 6. Resolve

1. Apply fix (hotfix or rollback)
2. Verify fix in production
3. Monitor for recurrence
4. Update status to resolved

### 7. Review

Schedule post-incident review within 48 hours.

---

## Communication

### Status Updates Template

```
🟡 UPDATE - [Incident Title]
Time: [timestamp]
Status: [Investigating | Identified | Fixing | Monitoring | Resolved]

What we know:
- [Current understanding]

What we're doing:
- [Current actions]

Next update: [time or "when we have more info"]
```

### Status Page Updates

**Investigating:**
> We are currently investigating reports of [issue]. We will provide updates as we learn more.

**Identified:**
> We have identified the cause of [issue]. Our team is working on a fix.

**Fixing:**
> A fix is being deployed for [issue]. We expect resolution within [timeframe].

**Monitoring:**
> A fix has been deployed. We are monitoring to ensure the issue is fully resolved.

**Resolved:**
> The issue affecting [feature] has been resolved. All systems are operating normally.

---

## Common Incidents

### Site Completely Down

**Quick diagnosis:**
```bash
# Check if site responds
curl -I https://your-site.com

# Check Vercel/Netlify status
# https://www.vercel-status.com/
# https://www.netlifystatus.com/

# Check recent deployments
vercel ls
```

**Common causes:**
- Bad deployment → Rollback
- DNS issue → Check DNS propagation
- Platform outage → Wait / failover
- Domain expiration → Renew immediately

### Database Connection Issues

**Quick diagnosis:**
```bash
# Check database status (example: Neon)
# Check your database provider's status page

# Test connection
npx prisma db pull
```

**Common causes:**
- Connection pool exhausted → Use pooler URL
- Database overloaded → Scale up
- Wrong credentials → Check env vars
- Network/firewall → Check IP allowlist

### Authentication Not Working

**Quick diagnosis:**
```bash
# Check auth provider status (GitHub, Google, etc.)
# Check NEXTAUTH_URL matches domain
# Check NEXTAUTH_SECRET is set
# Check OAuth callback URLs in provider
```

**Common causes:**
- NEXTAUTH_URL mismatch → Update env var
- Expired OAuth credentials → Regenerate
- Provider outage → Wait / alternative auth

### High Error Rate

**Quick diagnosis:**
```bash
# Check error tracking (Sentry)
# Look for patterns:
# - Specific endpoint?
# - Specific user action?
# - Started after deployment?
```

**Common causes:**
- Bug in recent deployment → Rollback
- Third-party API failing → Add fallback
- Data migration issue → Fix data

### Performance Degradation

**Quick diagnosis:**
```bash
# Check response times in Vercel Analytics
# Check database query performance
# Check for memory leaks
# Check for infinite loops
```

**Common causes:**
- Inefficient query → Add index / optimize
- Memory leak → Restart / fix code
- Traffic spike → Scale up
- Missing cache → Add caching

---

## Rollback Procedures

### Vercel Instant Rollback

1. Go to Vercel Dashboard > Deployments
2. Find last working deployment
3. Click "..." menu > "Promote to Production"
4. Confirm rollback

**Via CLI:**
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]
```

### Netlify Rollback

1. Go to Netlify Dashboard > Deploys
2. Find last working deploy
3. Click "Publish deploy"

### Git Revert

```bash
# Revert last commit
git revert HEAD --no-commit
git commit -m "revert: Rollback [commit-hash] due to [issue]"
git push

# Revert specific commit
git revert [commit-hash]
git push

# Revert merge commit
git revert -m 1 [merge-commit-hash]
git push
```

### Database Rollback

```bash
# If using Prisma migrations
npx prisma migrate resolve --rolled-back [migration-name]

# Restore from backup (provider-specific)
# Check your database provider's backup/restore docs
```

### Feature Flag Disable

```typescript
// If using feature flags, disable the broken feature
// Environment variable approach
const FEATURE_ENABLED = process.env.FEATURE_X_ENABLED === 'true'

// Set FEATURE_X_ENABLED=false in environment
```

---

## Post-Incident Review

### Blameless Postmortem Template

```markdown
# Incident Postmortem: [Title]

**Date:** [Date]
**Duration:** [Start time] - [End time] ([duration])
**Severity:** P[1-4]
**Lead:** [Name]

## Summary
[1-2 sentence summary of what happened]

## Impact
- Users affected: [number/percentage]
- Revenue impact: [if applicable]
- Duration: [how long users were affected]

## Timeline
| Time | Event |
|------|-------|
| HH:MM | [Event 1] |
| HH:MM | [Event 2] |
| HH:MM | Incident detected |
| HH:MM | Team notified |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |
| HH:MM | Issue resolved |

## Root Cause
[Detailed explanation of what caused the incident]

## Contributing Factors
- [Factor 1]
- [Factor 2]

## What Went Well
- [Thing 1]
- [Thing 2]

## What Could Be Improved
- [Improvement 1]
- [Improvement 2]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action 1] | @name | YYYY-MM-DD | ⬜ |
| [Action 2] | @name | YYYY-MM-DD | ⬜ |

## Lessons Learned
[Key takeaways for the team]
```

### Review Meeting Agenda

1. **Timeline review** (10 min)
   - Walk through what happened
   - No blame, focus on facts

2. **Root cause analysis** (15 min)
   - "5 Whys" technique
   - Identify contributing factors

3. **What went well** (5 min)
   - Celebrate quick detection/response
   - Note effective processes

4. **What could improve** (10 min)
   - Detection gaps
   - Response delays
   - Communication issues

5. **Action items** (10 min)
   - Preventive measures
   - Detection improvements
   - Process updates
   - Assign owners and deadlines

---

## Prevention

### Monitoring Setup

1. **Uptime monitoring** - UptimeRobot, Pingdom
2. **Error tracking** - Sentry, LogRocket
3. **Performance monitoring** - Vercel Analytics, SpeedCurve
4. **Log aggregation** - Vercel Logs, Datadog

### Alert Configuration

```yaml
# Example alert rules
alerts:
  - name: "Site Down"
    condition: "response_code != 200 for 2 minutes"
    severity: P1
    notify: ["pagerduty", "slack"]
    
  - name: "High Error Rate"
    condition: "error_rate > 5% for 5 minutes"
    severity: P2
    notify: ["slack"]
    
  - name: "Slow Response"
    condition: "p95_latency > 3s for 10 minutes"
    severity: P3
    notify: ["slack"]
```

### Pre-Deployment Checklist

- [ ] Changes tested locally
- [ ] Tests passing in CI
- [ ] Preview deployment verified
- [ ] Database migrations tested
- [ ] Rollback plan ready
- [ ] Team notified of deployment

---

## Related Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Deployment procedures
- [CI Monitoring Guide](../../workflows/CI_MONITORING_GUIDE.md) - CI/CD monitoring
- [Error Handling](../development/ERROR_HANDLING.md) - Application error handling
