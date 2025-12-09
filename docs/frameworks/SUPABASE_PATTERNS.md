# Supabase Patterns

Patterns, best practices, and common gotchas for building applications with Supabase.

## Quick Start

### Installation

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Install Auth helpers for Next.js (recommended)
npm install @supabase/auth-helpers-nextjs @supabase/ssr
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only
```

### Initialize Client

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts      # OAuth callback
│   ├── (protected)/
│   │   └── dashboard/page.tsx
│   └── layout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   ├── middleware.ts          # Middleware client
│   │   └── admin.ts               # Service role client
│   └── database.types.ts          # Generated types
├── hooks/
│   └── useUser.ts                 # Auth hook
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       └── AuthProvider.tsx
└── middleware.ts                  # Route protection
```

## Authentication

### Auth Provider (Client Components)

```tsx
// components/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContext {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
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

### Login Form

```tsx
// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <form onSubmit={handleEmailLogin}>
      {error && <div className="error">{error}</div>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign In'}
      </button>

      <div className="divider">or</div>

      <button type="button" onClick={() => handleOAuthLogin('google')}>
        Continue with Google
      </button>

      <button type="button" onClick={() => handleOAuthLogin('github')}>
        Continue with GitHub
      </button>
    </form>
  )
}
```

### OAuth Callback

```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}
```

### Protected Routes (Middleware)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users from auth pages
  if (user && (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup'
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Database Operations

### Generate Types

```bash
# Generate TypeScript types from your schema
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts

# Or with local development
npx supabase gen types typescript --local > lib/database.types.ts
```

### Typed Client

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Query Examples

```typescript
// Basic queries
const supabase = createClient()

// Select all
const { data: posts, error } = await supabase
  .from('posts')
  .select('*')

// Select with filter
const { data: post } = await supabase
  .from('posts')
  .select('*')
  .eq('id', postId)
  .single()

// Select with joins
const { data: postsWithAuthor } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(id, name, avatar_url),
    comments(id, content, created_at)
  `)
  .order('created_at', { ascending: false })
  .limit(10)

// Insert
const { data: newPost, error } = await supabase
  .from('posts')
  .insert({ title, content, user_id: user.id })
  .select()
  .single()

// Update
const { data: updatedPost } = await supabase
  .from('posts')
  .update({ title, content })
  .eq('id', postId)
  .select()
  .single()

// Delete
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)

// Upsert
const { data } = await supabase
  .from('profiles')
  .upsert({ id: user.id, name, bio })
  .select()
  .single()
```

### Server Actions

```typescript
// app/actions/posts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, user_id: user.id })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/posts')
  return data
}

export async function deletePost(postId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id) // Ensure user owns the post

  if (error) throw error

  revalidatePath('/posts')
}
```

## Real-time Subscriptions

### Subscribe to Changes

```tsx
// components/RealtimeMessages.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface Message {
  id: string
  content: string
  user_id: string
  created_at: string
}

export function RealtimeMessages({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial messages
    supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data)
      })

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.filter((m) => m.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId])

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
  )
}
```

### Presence (Online Users)

```tsx
// components/OnlineUsers.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'

interface PresenceState {
  user_id: string
  name: string
  online_at: string
}

export function OnlineUsers({ roomId }: { roomId: string }) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([])
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel(`room:${roomId}`)

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>()
        const users = Object.values(state).flat()
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            name: user.user_metadata.name || user.email,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, user])

  return (
    <div>
      <h3>Online ({onlineUsers.length})</h3>
      {onlineUsers.map((u) => (
        <div key={u.user_id}>{u.name}</div>
      ))}
    </div>
  )
}
```

## Storage

### Upload Files

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${user.id}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true,
  })

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${user.id}/avatar.png`)

// Download file
const { data, error } = await supabase.storage
  .from('documents')
  .download('path/to/file.pdf')

// Delete file
const { error } = await supabase.storage
  .from('avatars')
  .remove([`${user.id}/avatar.png`])

// List files
const { data: files, error } = await supabase.storage
  .from('documents')
  .list(user.id, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  })
```

### File Upload Component

```tsx
// components/AvatarUpload.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Props {
  userId: string
  currentUrl?: string
  onUpload: (url: string) => void
}

export function AvatarUpload({ userId, currentUrl, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    onUpload(publicUrl)
    setUploading(false)
  }

  return (
    <div>
      {currentUrl && (
        <Image src={currentUrl} alt="Avatar" width={100} height={100} />
      )}
      <label>
        {uploading ? 'Uploading...' : 'Upload Avatar'}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  )
}
```

## Row Level Security (RLS)

### Common Policies

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow users to read all posts
CREATE POLICY "Anyone can read posts"
ON posts FOR SELECT
TO authenticated, anon
USING (true);

-- Users can only insert their own posts
CREATE POLICY "Users can insert own posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Admin access (using custom claim)
CREATE POLICY "Admins can do anything"
ON posts FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
);
```

### Service Role (Bypass RLS)

```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

// This bypasses RLS - use only server-side
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Never expose this
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
```

## Edge Functions

### Create Function

```typescript
// supabase/functions/hello/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  const { data: { user } } = await supabaseClient.auth.getUser()

  return new Response(
    JSON.stringify({ message: `Hello ${user?.email}!` }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

### Deploy & Invoke

```bash
# Deploy function
supabase functions deploy hello

# Invoke from client
const { data, error } = await supabase.functions.invoke('hello', {
  body: { name: 'World' },
})
```

## Common Gotchas

### 1. Cookie Handling in Server Components

```typescript
// Always use async cookies() in Next.js 14+
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // Must await!
  // ...
}
```

### 2. Auth State Sync

```typescript
// Make sure to refresh router after auth changes
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (!error) {
  router.push('/dashboard')
  router.refresh() // Important! Refresh server components
}
```

### 3. RLS with Foreign Keys

```sql
-- When using foreign keys, ensure related tables have appropriate policies
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Join queries need SELECT on both tables
```

### 4. Realtime Filters

```typescript
// Filters are limited to simple equality
// Complex filters must be done client-side
.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'messages',
  filter: 'channel_id=eq.123', // Only eq supported
}, handler)
```

### 5. Storage RLS

```sql
-- Storage policies are separate from database policies
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Commands Reference

```bash
# Supabase CLI
npx supabase init                           # Initialize local project
npx supabase start                          # Start local development
npx supabase stop                           # Stop local development
npx supabase db push                        # Push migrations to remote
npx supabase db pull                        # Pull remote schema
npx supabase gen types typescript           # Generate types

# Migrations
npx supabase migration new migration_name   # Create new migration
npx supabase db reset                       # Reset local database

# Functions
npx supabase functions new function_name    # Create new function
npx supabase functions deploy               # Deploy all functions
npx supabase functions serve                # Serve locally
```

## Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

**Last Updated:** 2024-12-08
