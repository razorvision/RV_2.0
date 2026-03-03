# Harvest Time Entry Review - Clara Studio Integration Handoff

## What Exists Today

A working Slack-based review system for Harvest time entries, built as two n8n workflows managed by local build scripts.

### System Overview

```
Google Sheets (config)     Harvest API (data)
         \                    /
          v                  v
    n8n Evaluator Workflow
    (1BpEDRKZ6khUIpBX)
              |
              v
    Slack #harvest-review       <--- replace this with Clara Studio
              |
         (button click)
              v
    n8n Responder Workflow
    (1GJcpro3VusanEcM)
         /        \
        v          v
  Harvest API    Google Sheets
  (PATCH tags)   (ignore list, review log)
```

### Build Scripts (this repo)

| File | Purpose |
|------|---------|
| `build-evaluator-v2.mjs` | Pushes the evaluator workflow definition to n8n |
| `build-responder.mjs` | Pushes the responder workflow definition to n8n |

Both scripts use `N8N_API_KEY_WORK` env var to authenticate against `work-n8n.tuckercorp.org`.

### n8n Workflow IDs

| Workflow | ID | Webhook Path |
|----------|----|-------------|
| Evaluator | `1BpEDRKZ6khUIpBX` | `POST /webhook/harvest-time-evaluator` |
| Responder | `1GJcpro3VusanEcM` | `POST /webhook/harvest-review-actions` |

### Credential IDs (in n8n)

| Credential | ID | Service |
|------------|----|---------|
| Google Sheets OAuth2 | `DXbFUOqwi025RtyQ` | Google Sheets API |
| Harvest PAT | `a1TAJwRJA7HZ9DTY` | Harvest API v2 |
| Slack API | `5TsqK744dpKhRnHa` | Slack (BBCOM workspace) |

### Harvest Details

| Field | Value |
|-------|-------|
| Account ID | `869362` |
| Subdomain | `razorvision` (razorvision.harvestapp.com) |
| URL pattern for entries | `/time/day/{year}/{month}/{day}/{userId}` |

---

## Google Sheet

**ID:** `1WfX-Yy61Jb1PRKXVs3TG6lFmFc0mkBYIF9TZbv1RTY0`

### Tab: Clients

| Column | Description |
|--------|-------------|
| `client_name` | e.g., "Essential Lending" |
| `client_id` | Harvest client ID (e.g., 6663249) |
| `tag` | Tag name without brackets (e.g., "marketing") |
| `tag_keywords` | Comma-separated keywords that suggest this tag (e.g., "seo,ppc,ad campaign") |
| `expect_billable` | TRUE/FALSE - whether this client's entries should be billable |

Multiple rows per client (one per tag mapping).

### Tab: Projects

| Column | Description |
|--------|-------------|
| `client_name` | Client name |
| `project_id` | Harvest project ID |
| `project_name` | e.g., "Production Support" |
| `project_code` | Harvest project code (e.g., "WIS-038") |
| `purpose` | Free text, e.g., "Maintenance - bug fixes and support" |
| `monthly_budget_hours` | Budget threshold for warnings |
| `notes` | Free text |

### Tab: Team Members

| Column | Description |
|--------|-------------|
| `person` | Full name as it appears in Harvest |
| `expected_tasks` | Comma-separated Harvest task names (e.g., "Development,Code Review") |

### Tab: Ignore Patterns

| Column | Description |
|--------|-------------|
| `keyword` | Keyword to suppress (e.g., "seo") |
| `client` | Client scope (empty = global) |
| `added_by` | @username who added it |
| `added_date` | YYYY-MM-DD |
| `flag_type` | Which check to suppress (e.g., "missing_tag") |

### Tab: Review Log

| Column | Description |
|--------|-------------|
| `date` | YYYY-MM-DD |
| `reviewer` | @username |
| `action` | Action taken (e.g., "add_tag", "dismiss", "ignore_keyword") |
| `entry_id` | Harvest time entry ID |
| `flag_type` | Flag type that was resolved |
| `details` | Human-readable description |

### Tab: Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `min_description_length` | 5 | Chars below this trigger `short_description` |
| `vague_words` | meeting,work,support,misc,general,tasks,stuff,various,updates,call | Exact-match words triggering `vague_description` |
| `slack_channel` | #harvest-review | Target channel |
| `post_delay_ms` | 1500 | Delay between posts (unused currently) |

---

## Flag Types

| Flag | Severity | Condition | Actions Available |
|------|----------|-----------|-------------------|
| `missing_tag` | high | Notes contain a keyword from Clients tab but no `[tag]` prefix | Tag it, pick different tag, dismiss, ignore keyword |
| `empty_notes` | high | Entry has no description | Acknowledge |
| `vague_description` | medium | Notes exactly match a vague word | Acknowledge |
| `billable_mismatch` | medium | Entry non-billable but project is billable | Fix in Harvest (URL), dismiss |
| `role_mismatch` | medium | User logged a task not in their expected_tasks | Fix in Harvest (URL), dismiss |
| `short_description` | low | Notes exist but < min_description_length | Acknowledge |
| `budget_warning` | info | Project hours >110% or <50% of monthly budget | Summary-level only, no per-entry actions |

---

## Evaluator Data Flow

1. **Trigger**: Webhook POST or monthly cron (1st of month, 8am)
2. **Read config**: Batch-reads all 5 Google Sheets tabs in one API call
3. **Parse config**: Builds structured objects for clients, projects, team members, ignore patterns, settings
4. **Loop clients**: One iteration per client
5. **Fetch from Harvest**: Gets active projects + time entries for previous month
6. **Evaluate**: Runs 7 checks against each entry, produces `flags[]` array
7. **Build messages**: Groups flags by project, builds Slack Block Kit payloads
8. **Post to Slack**: One message per project (all flags for that project in one message)

### Key evaluator fields per flag

```javascript
{
  entryId: 2871929788,        // Harvest time entry ID
  date: '2026-02-24',         // spent_date
  user: 'Luciana Oliveira',   // user.name
  userId: 2873639,            // user.id (for Harvest URL)
  project: 'Production Support',
  projectDisplay: 'WIS-038 Production Support',  // code + name
  projectId: 45580562,
  task: 'Development',
  hours: 2.95,
  notes: 'Real applications routing...',
  billable: false,
  projectPurpose: 'Maintenance - bug fixes and support',
  flagType: 'missing_tag',
  severity: 'high',
  // Flag-specific fields:
  suggestedTag: '[marketing]',
  matchedKeyword: 'seo',
  availableTags: ['[marketing]', '[infrastructure]'],
  expectedTasks: ['Development', 'Code Review'],  // role_mismatch only
}
```

---

## Responder Action Handling

### Tag action (`harvest_add_tag`, `harvest_different_tag`)
1. GET current entry from Harvest
2. Prepend tag to notes: `[marketing] Original notes here`
3. PATCH entry with new notes
4. Log to Review Log sheet
5. Update Slack: replace actions block with "Tagged as [marketing] by @user"

### Ignore action (`harvest_ignore_keyword`)
1. Append row to Ignore Patterns sheet
2. Log to Review Log sheet
3. Update Slack: replace actions block with "'seo' added to ignore list by @user"

### Dismiss action (`harvest_dismiss`)
1. Log to Review Log sheet
2. Update Slack: replace actions block with "Dismissed by @user"

### Noop action (`harvest_open_harvest`)
1. URL button opens Harvest in browser (Slack handles this client-side)
2. Webhook receives the interaction but routes to dead end (output 3, no connection)
3. Message stays unchanged (buttons remain)

### Slack message update behavior (multi-flag messages)
The responder replaces ONLY the clicked flag's `actions` block (matched by `block_id` = `flag_{entryId}_{flagType}`). All other flags in the same message keep their buttons.

---

## What Clara Studio Needs

### Option A: Replace Slack entirely

The evaluator writes flags to a Clara Studio API endpoint instead of Slack. Clara provides the review UI.

**Evaluator changes:**
- Replace "Build Slack Messages" + "Post to Slack API" nodes with a single HTTP POST to Clara's API
- Send the raw `summary` + `flags[]` array (the data is already structured)
- Optionally keep a Slack notification: "13 flags ready for review - [Open Clara](url)"

**Clara Studio needs:**
1. **API endpoint**: `POST /api/harvest-reviews` - accepts `{ summary, flags[], clientName, clientId, monthLabel }`
2. **Database model**: Store review sessions with their flags and resolution status
3. **Review page**: `/admin/harvest-review` - table view of flags, grouped by project, with action buttons
4. **Action endpoints**:
   - `POST /api/harvest-reviews/:flagId/tag` - calls Harvest API to prepend tag
   - `POST /api/harvest-reviews/:flagId/dismiss` - marks as dismissed
   - `POST /api/harvest-reviews/:flagId/ignore` - adds to ignore list
5. **Harvest API integration**: Clara needs its own Harvest PAT or reuses the n8n credential via a proxy

### Option B: Hybrid (recommended)

Keep the n8n evaluator but post results to both Clara and Slack (notification only).

**Flow:**
1. n8n evaluator runs, produces flags
2. POSTs flags to Clara Studio API
3. Posts a summary to Slack: "13 flags for Essential Lending - Feb. [Review in Clara](url)"
4. Reviewer clicks Slack link, opens Clara Studio
5. Clara handles all review actions directly (no responder workflow needed for most actions)
6. For Harvest PATCH operations, Clara calls Harvest API directly or proxies through n8n

**Benefits:**
- n8n stays as the scheduler/data pipeline (what it's good at)
- Clara handles the UI/UX (what it's good at)
- Slack becomes notification-only (no Block Kit wrestling)
- The responder workflow can be simplified or retired

### Data contract (what Clara receives from the evaluator)

```typescript
interface HarvestReviewPayload {
  summary: {
    client: string;
    month: string;
    totalEntries: number;
    totalHours: number;
    totalFlags: number;
    flagsByType: Record<string, number>;
    flagsBySeverity: { high: number; medium: number; low: number };
    budgetWarnings: Array<{
      projectName: string;
      budgetHours: number;
      actualHours: number;
      pct: number;
      status: 'over_budget' | 'under_budget';
    }>;
    entriesAtLimit: boolean;
  };
  flags: Array<{
    entryId: number;
    date: string;
    user: string;
    userId: number;
    project: string;
    projectDisplay: string;
    projectId: number;
    task: string;
    hours: number;
    notes: string;
    billable: boolean;
    projectPurpose: string;
    flagType: 'missing_tag' | 'empty_notes' | 'vague_description' | 'short_description' | 'billable_mismatch' | 'role_mismatch';
    severity: 'high' | 'medium' | 'low';
    message: string;
    // Flag-specific:
    suggestedTag?: string;
    matchedKeyword?: string;
    availableTags?: string[];
    expectedTasks?: string[];
  }>;
  clientName: string;
  clientId: number;
  monthLabel: string; // "2026-02"
}
```

### Clara Studio tech stack (for reference)

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| Routing | React Router v6 |
| Backend | Hono + TypeScript |
| Database | Azure Cosmos DB |
| Auth | Microsoft Entra ID (MSAL) |
| Styling | Tailwind CSS |
| Data fetching | TanStack React Query |

To add the review page:
1. Create `apps/frontend/src/pages/HarvestReviewPage.tsx`
2. Add route in `App.tsx` under `<ProtectedRoute>`
3. Create backend routes in `apps/backend/src/routes/harvest-reviews.ts`
4. Add Cosmos DB container for review sessions

---

## Current State

- Both n8n workflows are deployed and active on `work-n8n.tuckercorp.org`
- Evaluator produces correct flags for Essential Lending (Feb 2026 data)
- Responder handles tag, dismiss, ignore, and noop actions correctly
- Slack messages use Layout A (code block table) grouped by project
- Google Sheet has all 6 tabs populated with Essential Lending data
- The 5-flag test limit has been removed
- Slack interactivity URL is configured: `https://work-n8n.tuckercorp.org/webhook/harvest-review-actions`

### Known limitations

- Harvest `billable` field is read-only on time entries (can't PATCH it). The "Fix in Harvest" button opens the user's timesheet in the browser instead.
- No deep-link to a specific Harvest entry exists. The URL opens the user's day view.
- `postDelayMs` from Settings tab is passed through but not used (HTTP Request node fires all at once).
- Slack's 50-block limit caps at ~7 flags per project message.
