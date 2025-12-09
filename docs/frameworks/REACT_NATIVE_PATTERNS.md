# React Native Patterns

Patterns, best practices, and common gotchas for React Native development with Expo.

## Quick Start

### Prerequisites

```bash
# Install Expo CLI (no longer required globally, but helpful)
npm install -g expo-cli

# Or use npx (recommended)
npx create-expo-app@latest my-app
cd my-app
npx expo start
```

### Recommended Tech Stack

| Category | Choice | Why |
|----------|--------|-----|
| Framework | Expo (Managed) | Faster development, OTA updates |
| Navigation | Expo Router | File-based routing, web support |
| State | Zustand | Simple, TypeScript-friendly |
| API | TanStack Query | Caching, mutations, offline |
| UI | Tamagui / NativeWind | Cross-platform styling |
| Auth | Expo AuthSession | OAuth handling |
| Storage | Expo SecureStore | Encrypted key-value |

## Project Structure

```
my-app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigator
│   │   ├── _layout.tsx    # Tab configuration
│   │   ├── index.tsx      # Home tab
│   │   └── profile.tsx    # Profile tab
│   ├── (auth)/            # Auth screens
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/
│   ├── ui/                # Reusable UI components
│   └── forms/             # Form components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth utilities
│   └── storage.ts        # Storage wrapper
├── stores/                # Zustand stores
├── types/                 # TypeScript types
├── assets/               # Images, fonts
├── app.json              # Expo config
└── eas.json              # EAS Build config
```

## Navigation (Expo Router)

### Basic Setup

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '@/lib/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
```

### Tab Navigator

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Protected Routes

```tsx
// app/(auth)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack />;
}
```

## API Integration

### TanStack Query Setup

```tsx
// lib/api.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// API client with auth
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

### Query Hook

```tsx
// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiFetch<User>(`/users/${userId}`),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) =>
      apiFetch<User>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
    },
  });
}
```

## State Management (Zustand)

```tsx
// stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Authentication

### OAuth with Expo AuthSession

```tsx
// lib/auth.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export function useGoogleAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'myapp',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      // Exchange code for tokens on your backend
      handleGoogleLogin(code);
    }
  }, [response]);

  return { promptAsync, isLoading: !request };
}
```

### Secure Token Storage

```tsx
// lib/storage.ts
import * as SecureStore from 'expo-secure-store';

export async function saveToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getToken(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key);
}
```

## Styling

### NativeWind (Tailwind for RN)

```tsx
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,tsx}', './components/**/*.{js,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};

// Usage in components
import { View, Text } from 'react-native';

export function Card({ children }) {
  return (
    <View className="bg-white rounded-lg p-4 shadow-md">
      <Text className="text-lg font-bold text-gray-900">
        {children}
      </Text>
    </View>
  );
}
```

### Platform-Specific Styles

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

## Forms

### React Hook Form + Zod

```tsx
// components/forms/LoginForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text, View } from 'react-native';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Password"
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
```

## Push Notifications

### Expo Notifications Setup

```tsx
// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied');
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id', // From app.json
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token.data;
}
```

## Common Gotchas

### 1. Expo Go Limitations

```tsx
// Some features require a development build
// - Push notifications (device token)
// - Background tasks
// - Native modules not in Expo SDK

// Create a development build:
npx expo prebuild
npx expo run:ios  // or run:android
```

### 2. Environment Variables

```tsx
// app.json / app.config.js
{
  "expo": {
    "extra": {
      "apiUrl": process.env.EXPO_PUBLIC_API_URL
    }
  }
}

// Access in code
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

// Or with EXPO_PUBLIC_ prefix (Expo SDK 49+)
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

### 3. Deep Linking

```tsx
// app.json
{
  "expo": {
    "scheme": "myapp",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "myapp" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "ios": {
      "associatedDomains": ["applinks:myapp.com"]
    }
  }
}

// Handle links
import { useURL } from 'expo-linking';

function App() {
  const url = useURL();

  useEffect(() => {
    if (url) {
      // Handle the deep link
      console.log('Deep link:', url);
    }
  }, [url]);
}
```

### 4. Keyboard Avoiding Views

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

function FormScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* Form content */}
    </KeyboardAvoidingView>
  );
}
```

### 5. Safe Area Handling

```tsx
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// In root layout
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack />
    </SafeAreaProvider>
  );
}

// In screens
function Screen() {
  return (
    <SafeAreaView edges={['top']}>
      {/* Content */}
    </SafeAreaView>
  );
}
```

## EAS Build & Submit

### Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### Commands

```bash
# Build for development
eas build --platform ios --profile development

# Build for production
eas build --platform all --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android

# OTA updates
eas update --branch production --message "Bug fixes"
```

## Commands Reference

```bash
# Development
npx expo start                  # Start dev server
npx expo start --clear          # Clear cache and start
npx expo start --ios            # Open in iOS Simulator
npx expo start --android        # Open in Android Emulator

# Building
npx expo prebuild               # Generate native projects
npx expo run:ios                # Build and run iOS
npx expo run:android            # Build and run Android

# EAS
eas build                       # Create a build
eas update                      # Deploy OTA update
eas submit                      # Submit to app stores

# Utilities
npx expo install package-name   # Install compatible package
npx expo doctor                 # Check for issues
npx expo-env-info               # Print environment info
```

## Related Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [TanStack Query](https://tanstack.com/query/latest)
- [NativeWind](https://www.nativewind.dev/)

---

**Last Updated:** 2024-12-08
