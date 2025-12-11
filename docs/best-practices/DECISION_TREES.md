# Decision Trees

Visual flowcharts to help you make common technical decisions. Follow the questions to reach the right choice for your situation.

## 📋 Available Decision Trees

- [Which Database?](#which-database)
- [Which State Management?](#which-state-management)
- [Which Deployment Platform?](#which-deployment-platform)
- [Which Testing Strategy?](#which-testing-strategy)
- [Which Caching Approach?](#which-caching-approach)
- [Which Authentication Method?](#which-authentication-method)
- [Which API Pattern?](#which-api-pattern)

---

## Which Database?

```
Start: What kind of data are you storing?
│
├─ Relational (users, orders, products)?
│  │
│  ├─ Need advanced features (full-text search, JSON)?
│  │  └─→ PostgreSQL ✅
│  │     + Most feature-rich
│  │     + Excellent for complex queries
│  │     + JSON support
│  │     - Heavier resource usage
│  │
│  ├─ Simple prototype or dev environment?
│  │  └─→ SQLite ✅
│  │     + Zero configuration
│  │     + Fast for small datasets
│  │     + File-based (no server)
│  │     - Not for production at scale
│  │
│  └─ Already using MySQL ecosystem?
│     └─→ MySQL ✅
│        + Wide hosting support
│        + Mature ecosystem
│        - Less advanced than PostgreSQL
│
├─ Document/Unstructured (logs, events)?
│  │
│  ├─ Need flexible schema and scaling?
│  │  └─→ MongoDB ✅
│  │     + Schema flexibility
│  │     + Horizontal scaling
│  │     + Good for hierarchical data
│  │     - Weaker transactions (vs SQL)
│  │
│  └─ Time-series data?
│     └─→ InfluxDB or TimescaleDB ✅
│
└─ Key-Value (cache, sessions)?
   │
   ├─ Need persistence?
   │  └─→ Redis with persistence ✅
   │
   └─ Just caching?
      └─→ Redis or Memcached ✅
```

### Quick Decision Table

| Use Case | Database | Why |
|----------|----------|-----|
| **User accounts, orders** | PostgreSQL | Relational, ACID, feature-rich |
| **Local dev/testing** | SQLite | Zero setup, fast, file-based |
| **Logs, events** | MongoDB | Flexible schema, good for docs |
| **Session storage** | Redis | Fast, TTL support |
| **Analytics** | PostgreSQL + TimescaleDB | Relational + time-series |

**See also:** [Database Comparison](../guides/decisions/DATABASE_COMPARISON.md)

---

## Which State Management?

```
Start: Where is the state used?
│
├─ Single component only?
│  └─→ useState ✅
│     + Simplest
│     + No boilerplate
│     + Easy to understand
│
├─ Few related components (parent + children)?
│  │
│  ├─ 2-3 levels of nesting?
│  │  └─→ Props ✅
│  │     + Explicit data flow
│  │     + Easy to debug
│  │
│  └─ Deep nesting or many props?
│     └─→ React Context ✅
│        + Avoids prop drilling
│        + Built-in to React
│        - Re-renders all consumers
│
├─ Used across many unrelated components?
│  │
│  ├─ Simple state (theme, user, settings)?
│  │  └─→ Zustand ✅
│  │     + Minimal boilerplate
│  │     + Good performance
│  │     + Easy to learn
│  │
│  ├─ Complex state with lots of actions?
│  │  └─→ Redux Toolkit ✅
│  │     + Predictable updates
│  │     + Excellent DevTools
│  │     + Ecosystem support
│  │     - More boilerplate
│  │
│  └─ Server state (API data)?
│     └─→ React Query or SWR ✅
│        + Automatic caching
│        + Revalidation
│        + Less code
│
└─ URL state (filters, pagination)?
   └─→ URL params + useSearchParams ✅
      + Shareable links
      + Back button works
      + Bookmarkable
```

### Quick Decision Table

| Scenario | Solution | Why |
|----------|----------|-----|
| **Button click counter** | useState | Single component |
| **Form with 3 fields** | useState + useReducer | Local complex state |
| **Theme toggle** | Context or Zustand | App-wide, simple |
| **User auth state** | Context + localStorage | App-wide, persistent |
| **Shopping cart** | Zustand or Redux Toolkit | Complex, many actions |
| **API data** | React Query | Server state |
| **Search filters** | URL params | Shareable, bookmarkable |

**See also:** [State Management Guide](STATE_MANAGEMENT.md)

---

## Which Deployment Platform?

```
Start: What's your priority?
│
├─ Simplest deployment (1-click)?
│  │
│  ├─ Next.js app?
│  │  └─→ Vercel ✅
│  │     + Zero config for Next.js
│  │     + Edge functions
│  │     + Automatic previews
│  │
│  └─ Other frameworks?
│     └─→ Netlify ✅
│        + Great DX
│        + Supports most frameworks
│
├─ Need full control (Docker, databases)?
│  │
│  ├─ Want simplicity with more control?
│  │  └─→ Railway ✅
│  │     + Easy database provisioning
│  │     + Docker support
│  │     + Good DX
│  │     - Less scalable than AWS
│  │
│  ├─ Global scale required?
│  │  └─→ Fly.io ✅
│  │     + Global edge deployment
│  │     + Docker-native
│  │     + Good for low latency
│  │
│  └─ Enterprise scale?
│     └─→ AWS/GCP/Azure ✅
│        + Most features
│        + Highest scale
│        - Steeper learning curve
│        - More expensive for small apps
│
└─ Static site only (no backend)?
   └─→ GitHub Pages or Netlify ✅
      + Free for public repos
      + Fast CDN
      + Simple CI/CD
```

### Quick Decision Table

| App Type | Platform | Why |
|----------|----------|-----|
| **Next.js** | Vercel | Best Next.js support |
| **Static site** | GitHub Pages/Netlify | Free, simple |
| **Full-stack + DB** | Railway | Easy DB setup, Docker support |
| **Global low-latency** | Fly.io | Edge deployment |
| **Enterprise** | AWS/GCP | Maximum scale and features |

**See also:** [Deployment Options](../guides/decisions/DEPLOYMENT_OPTIONS.md)

---

## Which Testing Strategy?

```
Start: What needs testing?
│
├─ Pure functions / utilities?
│  └─→ Unit Tests ✅
│     + Fast
│     + Easy to write
│     + High coverage
│     Tool: Jest or Vitest
│
├─ React components?
│  │
│  ├─ Logic-heavy component?
│  │  └─→ Unit Tests (React Testing Library) ✅
│  │     + Test behavior, not implementation
│  │     + Fast feedback
│  │
│  └─ Visual component (UI-focused)?
│     └─→ Storybook + Visual Regression ✅
│        + See all states
│        + Design review
│        + Visual diffs
│
├─ API endpoints?
│  │
│  ├─ Single endpoint logic?
│  │  └─→ Unit Tests ✅
│  │     + Mock database
│  │     + Test edge cases
│  │
│  └─ Multiple endpoints working together?
│     └─→ Integration Tests ✅
│        + Test with real DB
│        + Test auth flow
│        Tool: Supertest
│
├─ Complete user flows?
│  └─→ E2E Tests ✅
│     + Test like a user
│     + Catch integration bugs
│     + Confidence for releases
│     Tool: Playwright
│     Note: Slower, fewer tests
│
└─ Performance?
   └─→ Load Tests ✅
      Tool: k6 or Artillery
```

### Testing Pyramid

```
        ▲
       / \
      /   \      Few E2E Tests (Slow, expensive)
     /_____\     - User flows
    /       \    - Critical paths
   /         \
  /___________\  Some Integration Tests (Medium)
 /             \ - API endpoints
/               \- Multiple components
/_________________\  Many Unit Tests (Fast, cheap)
                    - Pure functions
                    - Component logic
```

### Coverage Goals

| Type | Coverage Target | Priority |
|------|----------------|----------|
| **Unit** | 80%+ | High |
| **Integration** | Key flows | Medium |
| **E2E** | Critical paths | High |

**See also:** [Testing Guide](../guides/development/TESTING_GUIDE.md)

---

## Which Caching Approach?

```
Start: What are you caching?
│
├─ API responses (GET requests)?
│  │
│  ├─ Client-side (browser)?
│  │  │
│  │  ├─ Using React Query or SWR?
│  │  │  └─→ Built-in caching ✅
│  │  │     + Automatic stale-while-revalidate
│  │  │     + Less code
│  │  │
│  │  └─ Manual caching?
│  │     └─→ localStorage or IndexedDB ✅
│  │        + Persists across sessions
│  │        + 5MB+ storage
│  │
│  └─ Server-side?
│     │
│     ├─ Simple cache?
│     │  └─→ In-memory (Map) ✅
│     │     + Fastest
│     │     - Lost on restart
│     │     - Not shared across servers
│     │
│     └─ Production cache?
│        └─→ Redis ✅
│           + Fast
│           + TTL support
│           + Shared across servers
│
├─ Database queries?
│  │
│  ├─ Rarely changes?
│  │  └─→ Redis with long TTL ✅
│  │
│  ├─ Changes frequently?
│  │  └─→ Short TTL or cache invalidation ✅
│  │
│  └─ Complex queries?
│     └─→ Materialized views ✅
│        + Database-level caching
│        + Refresh on schedule
│
├─ Static assets (images, CSS, JS)?
│  └─→ CDN + HTTP caching ✅
│     + Global distribution
│     + Offload server
│     Set: Cache-Control headers
│
└─ Computed values (expensive operations)?
   │
   ├─ Pure function (same input = same output)?
   │  └─→ Memoization (useMemo) ✅
   │
   └─ Needs persistence?
      └─→ Redis or database ✅
```

### Cache Invalidation Strategies

| Strategy | When to Use | How |
|----------|-------------|-----|
| **TTL (Time to Live)** | Data that can be slightly stale | Set expiration time |
| **Cache-aside** | General purpose | Check cache, if miss load + store |
| **Write-through** | Consistency critical | Update cache on every write |
| **Write-behind** | High write load | Async cache updates |
| **Invalidation** | Immediate consistency needed | Clear cache on data change |

**See also:** [Performance Guide](PERFORMANCE.md)

---

## Which Authentication Method?

```
Start: What's your use case?
│
├─ Internal tool (company employees)?
│  └─→ OAuth with company SSO ✅
│     + Single login
│     + Centralized management
│     Examples: Google Workspace, Azure AD
│
├─ Consumer app (public users)?
│  │
│  ├─ Want social login?
│  │  └─→ OAuth providers ✅
│  │     + Better UX (no password)
│  │     + Reduced risk
│  │     Providers: Google, GitHub, Apple
│  │
│  ├─ Need email/password?
│  │  │
│  │  ├─ Using Next.js?
│  │  │  └─→ NextAuth.js ✅
│  │  │     + Built for Next.js
│  │  │     + Many providers
│  │  │     + Good DX
│  │  │
│  │  └─ Framework-agnostic?
│  │     └─→ Supabase Auth or Auth0 ✅
│  │        + Managed service
│  │        + Handles complexity
│  │        - External dependency
│  │
│  └─ Mobile app?
│     └─→ Firebase Auth ✅
│        + Mobile SDKs
│        + Good offline support
│
├─ API authentication (machine-to-machine)?
│  │
│  ├─ Public API?
│  │  └─→ API Keys + Rate Limiting ✅
│  │
│  └─ Between services?
│     └─→ JWT or OAuth2 Client Credentials ✅
│
└─ High security (banking, healthcare)?
   └─→ Multi-factor authentication (MFA) ✅
      + SMS, TOTP, or hardware keys
      + Risk-based auth
```

### Session vs. JWT Tokens

| Use Session When | Use JWT When |
|------------------|--------------|
| Stateful server OK | Stateless API needed |
| Need instant logout | Microservices |
| Fewer concurrent users | Scaling horizontally |
| Simple setup | Cross-domain auth |

**See also:** [Auth Strategy Guide](../guides/decisions/AUTH_STRATEGY.md)

---

## Which API Pattern?

```
Start: What are you building?
│
├─ Simple CRUD operations?
│  └─→ REST ✅
│     + Well understood
│     + HTTP-native
│     + Easy to cache
│     Examples: GET /users, POST /users
│
├─ Complex queries or relationships?
│  │
│  ├─ Client needs flexible data fetching?
│  │  └─→ GraphQL ✅
│  │     + Request exactly what you need
│  │     + Single endpoint
│  │     + Strong typing
│  │     - More complex setup
│  │
│  └─ Server-driven?
│     └─→ REST with query params ✅
│        Examples: GET /users?include=posts
│
├─ Real-time updates?
│  │
│  ├─ Server pushes to clients?
│  │  └─→ WebSockets ✅
│  │     + Bidirectional
│  │     + Low latency
│  │     - More complex
│  │
│  ├─ Server broadcasts events?
│  │  └─→ Server-Sent Events (SSE) ✅
│  │     + Simpler than WebSockets
│  │     + HTTP-native
│  │     - One direction (server → client)
│  │
│  └─ Occasional updates OK?
│     └─→ Polling ✅
│        + Simplest
│        - Less efficient
│
└─ Remote procedure calls?
   └─→ tRPC or gRPC ✅
      + Type safety
      + Auto-generated clients
      + Good for internal services
```

### Quick Comparison

| Pattern | Best For | Pros | Cons |
|---------|----------|------|------|
| **REST** | CRUD operations | Simple, cacheable | Over/under-fetching |
| **GraphQL** | Complex queries | Flexible, efficient | Setup complexity |
| **WebSockets** | Real-time bidirectional | Low latency | Complex scaling |
| **SSE** | Real-time server push | Simpler than WS | One direction only |
| **tRPC** | TypeScript full-stack | Type safety | TypeScript only |
| **gRPC** | Microservices | Fast, efficient | Less browser support |

**See also:** [API Patterns Guide](API_DESIGN_PATTERNS.md)

---

## 💡 How to Use These Trees

1. **Start at the top** - Read the initial question
2. **Follow your path** - Answer each question honestly
3. **Reach a decision** - Follow the recommended approach
4. **Validate** - Check if constraints match your situation
5. **Adapt** - These are guides, not rules. Context matters!

---

## 🤔 What If Multiple Options Fit?

**Good news:** Many decisions aren't binary!

**Example:** "REST vs. GraphQL"
- Start with REST (simpler)
- Add GraphQL later if needed
- Or use both for different use cases

**Rule of thumb:** Choose the simplest option that meets your needs.

---

## 📚 Related Resources

- [Code Organization](CODE_ORGANIZATION.md)
- [Database Design](DATABASE_DESIGN.md)
- [Performance Guide](PERFORMANCE.md)
- [Security Hardening](SECURITY_HARDENING.md)
- [Framework Comparisons](../guides/decisions/)

---

**Last Updated:** 2024-12-11
