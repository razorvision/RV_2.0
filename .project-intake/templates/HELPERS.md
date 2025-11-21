# Helper Functions Documentation

Comprehensive documentation for all utility and helper functions in this project.

## Table of Contents

- [String Utilities](#string-utilities)
- [Date/Time Utilities](#datetime-utilities)
- [Validation Utilities](#validation-utilities)
- [Formatting Utilities](#formatting-utilities)
- [Data Transformation](#data-transformation)
- [API Utilities](#api-utilities)
- [Storage Utilities](#storage-utilities)
- [Error Handling](#error-handling)

---

## String Utilities

### `capitalize(str: string): string`

Capitalize the first letter of a string.

**Parameters:**
- `str` - The string to capitalize

**Returns:** Capitalized string

**Example:**
```typescript
capitalize('hello world');  // => 'Hello world'
capitalize('HELLO');         // => 'Hello'
```

**Implementation:**
```typescript
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

---

### `truncate(str: string, length: number, suffix?: string): string`

Truncate a string to a maximum length.

**Parameters:**
- `str` - The string to truncate
- `length` - Maximum length
- `suffix` - Optional suffix (default: '...')

**Returns:** Truncated string

**Example:**
```typescript
truncate('Hello world', 8);              // => 'Hello...'
truncate('Hello world', 8, '…');         // => 'Hello…'
truncate('Short', 10);                   // => 'Short'
```

**Implementation:**
```typescript
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}
```

---

### `slugify(str: string): string`

Convert a string to URL-friendly slug format.

**Parameters:**
- `str` - The string to slugify

**Returns:** Slugified string

**Example:**
```typescript
slugify('Hello World!');           // => 'hello-world'
slugify('  Multiple   Spaces  ');  // => 'multiple-spaces'
slugify('Special @#$ Characters'); // => 'special-characters'
```

**Implementation:**
```typescript
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

---

## Date/Time Utilities

### `formatDate(date: Date | string, format: string): string`

Format a date according to a specified format string.

**Parameters:**
- `date` - Date object or ISO string
- `format` - Format string (e.g., 'MM/DD/YYYY', 'YYYY-MM-DD')

**Returns:** Formatted date string

**Example:**
```typescript
formatDate(new Date('2024-01-15'), 'MM/DD/YYYY');  // => '01/15/2024'
formatDate(new Date('2024-01-15'), 'YYYY-MM-DD');  // => '2024-01-15'
formatDate(new Date('2024-01-15'), 'MMM D, YYYY'); // => 'Jan 15, 2024'
```

**Format Tokens:**
- `YYYY` - 4-digit year
- `MM` - 2-digit month
- `DD` - 2-digit day
- `MMM` - Short month name
- `HH` - 2-digit hour (24h)
- `mm` - 2-digit minute
- `ss` - 2-digit second

---

### `getRelativeTime(date: Date | string): string`

Get relative time string (e.g., '2 hours ago').

**Parameters:**
- `date` - Date object or ISO string

**Returns:** Relative time string

**Example:**
```typescript
getRelativeTime(new Date(Date.now() - 5000));        // => 'just now'
getRelativeTime(new Date(Date.now() - 120000));      // => '2 minutes ago'
getRelativeTime(new Date(Date.now() - 3600000));     // => '1 hour ago'
getRelativeTime(new Date(Date.now() - 86400000));    // => '1 day ago'
```

---

### `isDateInRange(date: Date, start: Date, end: Date): boolean`

Check if a date is within a range.

**Parameters:**
- `date` - Date to check
- `start` - Range start date
- `end` - Range end date

**Returns:** True if date is in range

**Example:**
```typescript
const date = new Date('2024-01-15');
const start = new Date('2024-01-01');
const end = new Date('2024-01-31');
isDateInRange(date, start, end);  // => true
```

---

## Validation Utilities

### `isValidEmail(email: string): boolean`

Validate email address format.

**Parameters:**
- `email` - Email string to validate

**Returns:** True if valid email

**Example:**
```typescript
isValidEmail('user@example.com');    // => true
isValidEmail('invalid.email');       // => false
isValidEmail('user@domain');         // => false
```

**Implementation:**
```typescript
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

---

### `isValidUrl(url: string): boolean`

Validate URL format.

**Parameters:**
- `url` - URL string to validate

**Returns:** True if valid URL

**Example:**
```typescript
isValidUrl('https://example.com');      // => true
isValidUrl('http://localhost:3000');    // => true
isValidUrl('not a url');                // => false
```

---

### `isStrongPassword(password: string): boolean`

Check if password meets strength requirements.

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Parameters:**
- `password` - Password string to validate

**Returns:** True if password is strong

**Example:**
```typescript
isStrongPassword('Password123!');   // => true
isStrongPassword('weak');           // => false
isStrongPassword('NoNumbers!');     // => false
```

---

## Formatting Utilities

### `formatCurrency(amount: number, currency: string = 'USD'): string`

Format number as currency.

**Parameters:**
- `amount` - Amount to format
- `currency` - Currency code (default: 'USD')

**Returns:** Formatted currency string

**Example:**
```typescript
formatCurrency(1234.56);             // => '$1,234.56'
formatCurrency(1234.56, 'EUR');      // => '€1,234.56'
formatCurrency(1234.56, 'GBP');      // => '£1,234.56'
```

**Implementation:**
```typescript
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

---

### `formatNumber(num: number, decimals: number = 0): string`

Format number with thousand separators.

**Parameters:**
- `num` - Number to format
- `decimals` - Number of decimal places (default: 0)

**Returns:** Formatted number string

**Example:**
```typescript
formatNumber(1234567);        // => '1,234,567'
formatNumber(1234.567, 2);    // => '1,234.57'
formatNumber(0.1234, 4);      // => '0.1234'
```

---

### `formatBytes(bytes: number, decimals: number = 2): string`

Format bytes to human-readable size.

**Parameters:**
- `bytes` - Number of bytes
- `decimals` - Decimal places (default: 2)

**Returns:** Formatted size string

**Example:**
```typescript
formatBytes(1024);              // => '1 KB'
formatBytes(1048576);           // => '1 MB'
formatBytes(1073741824);        // => '1 GB'
formatBytes(1234567, 2);        // => '1.18 MB'
```

---

## Data Transformation

### `groupBy<T>(array: T[], key: keyof T): Record<string, T[]>`

Group array items by a property.

**Parameters:**
- `array` - Array to group
- `key` - Property key to group by

**Returns:** Object with grouped items

**Example:**
```typescript
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
];

groupBy(users, 'role');
// => {
//   admin: [{ name: 'John', role: 'admin' }, { name: 'Bob', role: 'admin' }],
//   user: [{ name: 'Jane', role: 'user' }]
// }
```

---

### `uniqBy<T>(array: T[], key: keyof T): T[]`

Remove duplicates from array based on a property.

**Parameters:**
- `array` - Array to deduplicate
- `key` - Property key to check uniqueness

**Returns:** Array with unique items

**Example:**
```typescript
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 1, name: 'Duplicate' }
];

uniqBy(items, 'id');
// => [
//   { id: 1, name: 'Item 1' },
//   { id: 2, name: 'Item 2' }
// ]
```

---

### `sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[]`

Sort array by a property.

**Parameters:**
- `array` - Array to sort
- `key` - Property key to sort by
- `order` - Sort order (default: 'asc')

**Returns:** Sorted array

**Example:**
```typescript
const users = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 }
];

sortBy(users, 'age');        // Sort by age ascending
sortBy(users, 'name', 'desc'); // Sort by name descending
```

---

## API Utilities

### `buildQueryString(params: Record<string, any>): string`

Build URL query string from object.

**Parameters:**
- `params` - Object with query parameters

**Returns:** Query string

**Example:**
```typescript
buildQueryString({ page: 1, limit: 20, search: 'query' });
// => '?page=1&limit=20&search=query'

buildQueryString({ tags: ['javascript', 'typescript'] });
// => '?tags=javascript&tags=typescript'
```

---

### `debounce<T extends (...args: any[]) => any>(func: T, delay: number): T`

Debounce function execution.

**Parameters:**
- `func` - Function to debounce
- `delay` - Delay in milliseconds

**Returns:** Debounced function

**Example:**
```typescript
const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

handleSearch('hello');  // Called after 300ms of inactivity
```

---

### `throttle<T extends (...args: any[]) => any>(func: T, limit: number): T`

Throttle function execution.

**Parameters:**
- `func` - Function to throttle
- `limit` - Minimum time between calls (ms)

**Returns:** Throttled function

**Example:**
```typescript
const handleScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

window.addEventListener('scroll', handleScroll);
```

---

## Storage Utilities

### `localStorage.get<T>(key: string, defaultValue?: T): T | null`

Get item from localStorage with type safety.

**Parameters:**
- `key` - Storage key
- `defaultValue` - Default value if not found

**Returns:** Stored value or default

**Example:**
```typescript
localStorage.get<User>('user');
localStorage.get<string[]>('tags', []);
```

---

### `localStorage.set<T>(key: string, value: T): void`

Set item in localStorage with JSON serialization.

**Parameters:**
- `key` - Storage key
- `value` - Value to store

**Example:**
```typescript
localStorage.set('user', { id: 1, name: 'John' });
localStorage.set('settings', { theme: 'dark' });
```

---

### `localStorage.remove(key: string): void`

Remove item from localStorage.

**Parameters:**
- `key` - Storage key

**Example:**
```typescript
localStorage.remove('user');
```

---

## Error Handling

### `createError(message: string, code?: string, details?: any): AppError`

Create standardized error object.

**Parameters:**
- `message` - Error message
- `code` - Optional error code
- `details` - Optional error details

**Returns:** Error object

**Example:**
```typescript
throw createError('User not found', 'USER_NOT_FOUND', { userId: 123 });
```

---

### `handleApiError(error: unknown): ErrorResponse`

Handle and format API errors.

**Parameters:**
- `error` - Error object

**Returns:** Formatted error response

**Example:**
```typescript
try {
  await api.get('/users');
} catch (error) {
  const formattedError = handleApiError(error);
  console.error(formattedError.message);
}
```

---

## Testing Helpers

### Example Usage in Tests

```typescript
import { formatDate, isValidEmail, groupBy } from '@/lib/helpers';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/15/2024');
  });
});

describe('isValidEmail', () => {
  it('validates correct email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

---

## Best Practices

1. **Always provide type definitions** for TypeScript helpers
2. **Include JSDoc comments** for better IDE support
3. **Write unit tests** for all helper functions
4. **Keep helpers pure** - avoid side effects when possible
5. **Use descriptive names** - function purpose should be obvious
6. **Handle edge cases** - null, undefined, empty strings, etc.
7. **Document examples** - show real-world usage
8. **Optimize performance** - use memoization for expensive operations

---

**Last Updated:** 2024-01-15
**Location:** `src/lib/helpers` or `src/utils`
