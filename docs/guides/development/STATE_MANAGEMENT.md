---
title: State Management Guide
parent: Development
grand_parent: Guides
---
# State Management Guide

Strategies for managing state in React applications, from local component state to global application state.

## Table of Contents

- [State Types](#state-types)
- [Local State (useState)](#local-state-usestate)
- [Derived State](#derived-state)
- [Context API](#context-api)
- [Server State (TanStack Query)](#server-state-tanstack-query)
- [URL State](#url-state)
- [Form State](#form-state)
- [Decision Framework](#decision-framework)

## State Types

| Type | Tool | Use Case |
|------|------|----------|
| **Local** | `useState` | Component-specific UI state |
| **Derived** | `useMemo`, computed | Calculated from other state |
| **Shared** | Context | Theme, auth, app-wide settings |
| **Server** | TanStack Query | API data, caching |
| **URL** | `useSearchParams` | Filters, pagination, shareable state |
| **Form** | React Hook Form | Form inputs, validation |

## Local State (useState)

### When to Use

- UI toggles (modals, dropdowns, tabs)
- Input values before submission
- Component-specific data
- Temporary state that doesn't need to persist

### Examples

```typescript
// Simple toggle
function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <ModalContent onClose={() => setIsOpen(false)} />}
    </>
  );
}

// Complex state object
interface FilterState {
  search: string;
  category: string;
  sortBy: 'name' | 'date';
}

function ProductList() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    sortBy: 'name',
  });

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <input
      value={filters.search}
      onChange={(e) => updateFilter('search', e.target.value)}
    />
  );
}
```

### State Updates with Previous Value

```typescript
// Always use callback form when new state depends on previous
function Counter() {
  const [count, setCount] = useState(0);

  // ✅ Correct - uses previous value
  const increment = () => setCount(prev => prev + 1);

  // ❌ Wrong - may miss updates in concurrent mode
  const incrementWrong = () => setCount(count + 1);

  return <button onClick={increment}>{count}</button>;
}
```

## Derived State

### useMemo for Expensive Calculations

```typescript
function ProductList({ products, filters }) {
  // Derive filtered products from props
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.category === filters.category || filters.category === 'all')
      .filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()))
      .sort((a, b) => a[filters.sortBy].localeCompare(b[filters.sortBy]));
  }, [products, filters]);

  return (
    <ul>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
```

### When NOT to Use useMemo

```typescript
// ❌ Don't memoize simple operations
const fullName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName]
);

// ✅ Just compute directly
const fullName = `${firstName} ${lastName}`;
```

## Context API

### When to Use

- Theme (light/dark mode)
- Authentication state
- Locale/language
- Feature flags
- Data that many components need

### Creating Type-Safe Context

```typescript
// contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Avoiding Context Re-renders

Split context by update frequency:

```typescript
// ❌ Bad - everything re-renders when user changes
const AppContext = createContext({ user, theme, notifications });

// ✅ Good - separate contexts
const UserContext = createContext(user);
const ThemeContext = createContext(theme);
const NotificationsContext = createContext(notifications);
```

Memoize context value:

```typescript
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // ✅ Memoize to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Server State (TanStack Query)

### Why Use It?

- Automatic caching and refetching
- Loading and error states
- Background updates
- Optimistic updates
- Request deduplication

### Basic Query

```typescript
// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';

async function fetchUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

// Usage in component
function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Query with Parameters

```typescript
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only fetch when userId exists
  });
}
```

### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser: CreateUserInput) =>
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      }).then(res => res.json()),

    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage
function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = (data: CreateUserInput) => {
    createUser.mutate(data, {
      onSuccess: () => toast.success('User created!'),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Optimistic Updates

```typescript
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todoId: string) =>
      fetch(`/api/todos/${todoId}/toggle`, { method: 'POST' }),

    onMutate: async (todoId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      );

      return { previousTodos };
    },

    onError: (err, todoId, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
```

## URL State

### When to Use

- Search/filter parameters
- Pagination (page, limit)
- Sort order
- Tab selection
- Any state that should be shareable via URL

### Using useSearchParams

```typescript
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function ProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sortBy') || 'name';

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <select
        value={category}
        onChange={(e) => updateParams({ category: e.target.value })}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => updateParams({ sortBy: e.target.value })}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}
```

### Custom Hook for URL State

```typescript
// hooks/useQueryParams.ts
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryParams<T extends Record<string, string>>() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = Object.fromEntries(searchParams.entries()) as T;

  const setParams = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return [params, setParams] as const;
}

// Usage
function ProductPage() {
  const [params, setParams] = useQueryParams<{
    search: string;
    category: string;
    page: string;
  }>();

  return (
    <input
      value={params.search || ''}
      onChange={(e) => setParams({ search: e.target.value, page: '1' })}
    />
  );
}
```

## Form State

### React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await loginUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

## Decision Framework

```
Is this data from an API?
├─ Yes → Use TanStack Query
└─ No
   ├─ Should it be in the URL (shareable, bookmarkable)?
   │  ├─ Yes → Use URL state (useSearchParams)
   │  └─ No
   │     ├─ Is it form data?
   │     │  ├─ Yes → Use React Hook Form
   │     │  └─ No
   │     │     ├─ Do many components need it?
   │     │     │  ├─ Yes → Use Context
   │     │     │  └─ No → Use useState
   │     │     └─ Is it derived from other state?
   │     │        ├─ Yes → Use useMemo / computed
   │     │        └─ No → Use useState
```

### Quick Reference

| Scenario | Solution |
|----------|----------|
| Toggle modal open/closed | `useState` |
| Current logged-in user | Context |
| List of products from API | TanStack Query |
| Search query in URL | `useSearchParams` |
| Form inputs | React Hook Form |
| Filtered list (from existing data) | `useMemo` |
| Theme preference | Context + localStorage |
| Shopping cart | Context or TanStack Query |

## Related Resources

- [TanStack Query Documentation](https://tanstack.com/query)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Error Handling Guide](ERROR_HANDLING.md)
- [API Patterns](API_PATTERNS.md)
