# State Management Guide

Patterns and best practices for managing state in React applications.

## Table of Contents

- [State Categories](#state-categories)
- [Local State](#local-state)
- [Global State (Context)](#global-state-context)
- [Server State](#server-state)
- [URL State](#url-state)
- [Form State](#form-state)
- [Decision Framework](#decision-framework)

---

## State Categories

| Type | Scope | Examples | Tool |
|------|-------|----------|------|
| **Local** | Single component | Form inputs, toggles, modals | `useState` |
| **Lifted** | Parent + children | Shared form data, filters | `useState` + props |
| **Global** | Entire app | User session, theme, preferences | Context, Zustand |
| **Server** | Cached from API | Users, posts, products | TanStack Query |
| **URL** | Browser URL | Filters, pagination, tabs | `useSearchParams` |
| **Form** | Form lifecycle | Validation, submission | React Hook Form |

---

## Local State

### useState for Component State

```typescript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### useReducer for Complex State

```typescript
import { useReducer } from 'react'

type State = {
  items: Item[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Item[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    default:
      return state
  }
}

function ItemList() {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    loading: false,
    error: null,
  })

  // Usage
  dispatch({ type: 'FETCH_START' })
  dispatch({ type: 'ADD_ITEM', payload: newItem })
}
```

### When to Use Each

- **useState**: Simple values, toggles, single inputs
- **useReducer**: Multiple related values, complex transitions, actions

---

## Global State (Context)

### Creating a Context

```typescript
// contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

### Using the Context

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// components/ThemeToggle.tsx
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  )
}
```

### Auth Context Example

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const value: AuthContextValue = {
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login: () => signIn(),
    logout: () => signOut(),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### Avoiding Context Performance Issues

```typescript
// Split contexts to prevent unnecessary re-renders

// Instead of one large context:
const AppContext = createContext({ user, theme, settings, notifications })

// Use separate contexts:
const UserContext = createContext(user)
const ThemeContext = createContext(theme)
const SettingsContext = createContext(settings)

// Memoize context values
const value = useMemo(
  () => ({ theme, setTheme, toggleTheme }),
  [theme]
)
```

---

## Server State

### TanStack Query Setup

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// app/providers.tsx
'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Fetching Data

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Fetch users
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      return res.json()
    },
  })
}

// Fetch single user
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`)
      if (!res.ok) throw new Error('Failed to fetch user')
      return res.json()
    },
    enabled: !!id, // Only fetch if id exists
  })
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create user')
      return res.json()
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### Using in Components

```typescript
function UserList() {
  const { data, isLoading, error } = useUsers()
  const createUser = useCreateUser()

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return (
    <>
      <button
        onClick={() => createUser.mutate({ name: 'New User' })}
        disabled={createUser.isPending}
      >
        Add User
      </button>
      
      <ul>
        {data.users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}
```

### Optimistic Updates

```typescript
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users'])

      // Optimistically update
      queryClient.setQueryData(['users'], (old: any) => ({
        ...old,
        users: old.users.filter((u: User) => u.id !== deletedId),
      }))

      // Return context for rollback
      return { previousUsers }
    },
    onError: (err, deletedId, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context?.previousUsers)
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

---

## URL State

### Using Search Params (Next.js)

```typescript
'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

function ProductFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <select
        value={category}
        onChange={(e) => updateFilters({ category: e.target.value, page: '1' })}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={sort}
        onChange={(e) => updateFilters({ sort: e.target.value })}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </>
  )
}
```

### Custom Hook for URL State

```typescript
// hooks/useQueryState.ts
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function useQueryState(key: string, defaultValue: string = '') {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const value = searchParams.get(key) || defaultValue

  const setValue = useCallback(
    (newValue: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (newValue === null || newValue === '') {
        params.delete(key)
      } else {
        params.set(key, newValue)
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [key, pathname, router, searchParams]
  )

  return [value, setValue] as const
}

// Usage
function SearchBox() {
  const [query, setQuery] = useQueryState('q')
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

---

## Form State

### React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(data: FormData) {
    try {
      await login(data)
    } catch (error) {
      setError('root', { message: 'Invalid credentials' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input {...register('password')} type="password" placeholder="Password" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>
          <input {...register('rememberMe')} type="checkbox" />
          Remember me
        </label>
      </div>

      {errors.root && <div className="error">{errors.root.message}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  )
}
```

---

## Decision Framework

### Which State Tool to Use

```
Is it from an API?
├── Yes → TanStack Query (server state)
└── No → Continue...

Should it persist in URL?
├── Yes → useSearchParams (URL state)
└── No → Continue...

Is it form data?
├── Yes → React Hook Form
└── No → Continue...

Used by multiple components?
├── No → useState (local state)
├── Yes, same subtree → Lift state up
└── Yes, across app → Context or Zustand
```

### Common Mistakes

1. **Putting everything in global state** - Only globalize what needs to be global
2. **Not using server state tools** - Don't reinvent caching and syncing
3. **Storing derived state** - Compute it instead
4. **Ignoring URL state** - Filters and pagination should be in URL
5. **Over-engineering simple forms** - Sometimes `useState` is enough

---

## Related Documentation

- [Testing Guide](TESTING_GUIDE.md) - Testing state and hooks
- [Error Handling](ERROR_HANDLING.md) - Handling async errors
- [API Patterns](API_PATTERNS.md) - Data fetching
