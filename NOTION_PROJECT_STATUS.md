# Product Features & Development Status Report

## Executive Summary

The product roadmap contains **15+ active items** across three primary clients (CBB, DLC, Wise Loan). Several items are blocked waiting for client decisions or third-party vendor confirmation. Below is a breakdown of critical issues by priority and status.

---

## Critical Issues (1 - URGENT Priority)

### CBB (Client Updates)
1. **Make ID upload required** - *Ready For Dev, 2-High*
   - Current workaround exists but has security/compliance gaps
   - Implementation needed for proper ID verification workflow
   - Luciana has a good implementation suggestion ready to proceed this week

### DLC (Client Updates)
1. **Long Term Product - New $500 requirement** - *UAT, 1-URGENT*
   - Status: Awaiting approval from Jesse before production release
   - UAT guide sent for review

2. **Long Term Product - New disclosure** - *UAT, 1-URGENT*
   - Status: Same as above - awaiting Jesse's approval

3. **New Store (514-Menasha)** - *Ready For Dev, 1-URGENT*
   - Status: Just added to board
   - Luciana should complete today

4. **Kiosk Application Issues** - *Requirements Gathering, 1-URGENT*
   - Status: Newly flagged, needs urgent review
   - RV creating troubleshooting documentation

### Wise Loan (Client Updates)
1. **Agora Dropoff** - *Released in Production, 1-URGENT*
   - Status: Now resolved with examples from Tekambi

2. **Replace Olark chat with uContact** - *Released in Production, 1-URGENT*
   - Status: Main work complete
   - Follow-up: Footer link fix pending (Leslie coordinating with their team)

---

## High-Priority Items (2 - HIGH) - Requires Decisions

### CBB
1. **Instead of grabbing premium pull - Flexibility on amount** - *Solution Design/Estimate, 2-High*
   - Blocker: Roland to provide field spec Wednesday
   - Need: Clarification on exact flow for agents (new field vs. normal amount logic)

2. **Auth.net transaction update - Zak** - *Solution Design/Estimate, 2-High*
   - Issue: Need to extract and display last 4 digits of transaction data
   - Action: Luciana reviewing options in depth this week

3. **Payment auto-draft setup** - *Requirements Gathering, 2-High*
   - Large project requiring architecture decisions:
     - When to capture payment info?
     - What user capabilities needed? (changing auto-draft, deleting, editing)
     - Do agents currently handle this in-store?
   - Requires discussion with Roland + vendor (JournalTech)

### DLC
1. **IDology (ID Verification)** - *Waiting on Client/Vendor, 2-High*
   - Status: Testing ongoing with vendor
   - Jesse working with IDology; Robe testing at Infinity
   - Next step: Awaiting feedback from Infinity testing

---

## Medium-Priority Items (3 - MEDIUM) - Vendor/Strategic Decisions

### CBB
1. **Upcoming strategic discussions for video calls** - *Requirements Gathering, 3-Medium*
   - Issue: Current Zoom solution needs improvement
   - Recommendation: Explore vendor solutions (too expensive to build)
   - Pending: Client clarification on call volume and growth projections

### DLC
1. **Recurring Payments** - *Waiting on Client/Vendor, 3-Medium*
   - Status: Repay & Infinity created plan, but doesn't work for Jesse
   - Blocker: Awaiting their response to email

2. **Save, Update, Delete, View Payment cards** - *Waiting on Client/Vendor, 3-Medium*
   - Same blocker as above - tied to Repay/Infinity coordination

3. **Monthly Error Report** - *In Progress, 3-Medium*
   - Status: Sent 12/15
   - Assigned: Luciana & Andrew

---

## Low-Priority Items (4 - LOW)

### CBB
1. **Instant ID verification** - *Requirements Gathering, 4-Low*
   - Questions: Replace existing ID collection? Vendor flows?
   - Exploring IDology iframe integration (current partner)

---

## Key Blockers Summary

| Blocker | Items Affected | Impact | Timeline |
|---------|---|---|---|
| **Client (Roland/Jesse) decisions** | Payment auto-draft, Premium field flexibility, Recurring payments | 3+ items stuck | Pending meetings |
| **Vendor (IDology/Infinity/Repay)** | IDology testing, Recurring payments, Payment cards | 3+ items stuck | Awaiting vendor responses |
| **Vendor approval** | Video calls solution | Strategic decision needed | Next week |
| **UAT approval (Jesse)** | DLC new requirements, DLC disclosure | 2 urgent items can't release | This week |

---

## Recommendations

1. **Prioritize Jesse's approvals** - Two URGENT DLC items waiting on UAT sign-off for production release
2. **Schedule Roland meeting** - Payment auto-draft is a large project requiring architecture discussion + vendor coordination
3. **Follow up with Infinity/Repay** - Multiple payment-related items stuck on their responses
4. **Notion cleanup** - Consider archiving completed items (Agora Dropoff, Olark chat, etc.) for board clarity

---

**Report Date:** December 16, 2025
**Data Source:** Notion Product Features Board (Product Roadmap)
