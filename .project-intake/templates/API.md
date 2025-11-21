# API Documentation

Comprehensive documentation for all API endpoints in this project.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Describe your authentication method:

### JWT Bearer Token

```bash
Authorization: Bearer <your-jwt-token>
```

**How to obtain token:**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Common Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Error Response Format

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "field": "fieldName",  // Optional: for validation errors
    "details": {}  // Optional: additional error context
  }
}
```

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP address
- **Authenticated:** 1000 requests per 15 minutes per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Validation:**
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, number, special character
- `name`: Required, 2-50 characters

**Errors:**
- `400` - Validation error
- `409` - Email already exists

---

### POST /api/auth/login

Authenticate and receive access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `429` - Too many login attempts

---

### POST /api/auth/refresh

Refresh access token.

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401` - Invalid or expired token

---

## User Endpoints

### GET /api/users/:id

Get user by ID.

**Authentication:** Required

**Parameters:**
- `id` (path) - User ID

**Response:** `200 OK`
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `401` - Not authenticated
- `404` - User not found

---

### PATCH /api/users/:id

Update user profile.

**Authentication:** Required (must be owner or admin)

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Response:** `200 OK`
```json
{
  "id": "123",
  "email": "newemail@example.com",
  "name": "Jane Doe",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Not authorized to update this user
- `409` - Email already in use

---

### DELETE /api/users/:id

Delete user account.

**Authentication:** Required (must be owner or admin)

**Response:** `204 No Content`

**Errors:**
- `401` - Not authenticated
- `403` - Not authorized to delete this user
- `404` - User not found

---

## Resource Endpoints

### GET /api/resources

List all resources with pagination.

**Authentication:** Optional (returns public resources if not authenticated)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page (max 100) |
| sort | string | createdAt | Sort field |
| order | string | desc | Sort order (asc/desc) |
| search | string | - | Search query |
| filter | string | - | Filter by status |

**Example:**
```bash
GET /api/resources?page=1&limit=20&sort=name&order=asc&search=project
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "1",
      "name": "Resource Name",
      "description": "Resource description",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### POST /api/resources

Create a new resource.

**Authentication:** Required

**Request:**
```json
{
  "name": "New Resource",
  "description": "Description of the resource",
  "status": "draft"
}
```

**Response:** `201 Created`
```json
{
  "id": "new-id",
  "name": "New Resource",
  "description": "Description of the resource",
  "status": "draft",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Validation:**
- `name`: Required, 3-100 characters
- `description`: Optional, max 500 characters
- `status`: Optional, enum: draft, active, archived

---

### GET /api/resources/:id

Get resource by ID.

**Authentication:** Optional (only returns public resources if not authenticated)

**Response:** `200 OK`
```json
{
  "id": "1",
  "name": "Resource Name",
  "description": "Resource description",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "metadata": {
    "views": 150,
    "likes": 23
  }
}
```

---

### PATCH /api/resources/:id

Update resource.

**Authentication:** Required (must be owner or admin)

**Request:**
```json
{
  "name": "Updated Name",
  "status": "active"
}
```

**Response:** `200 OK`
```json
{
  "id": "1",
  "name": "Updated Name",
  "description": "Resource description",
  "status": "active",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

---

### DELETE /api/resources/:id

Delete resource.

**Authentication:** Required (must be owner or admin)

**Response:** `204 No Content`

---

## Webhooks

### Registering a Webhook

```bash
POST /api/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["resource.created", "resource.updated"],
  "secret": "your-webhook-secret"
}
```

### Webhook Payload

```json
{
  "event": "resource.created",
  "data": {
    "id": "1",
    "name": "New Resource"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "signature": "sha256=..."
}
```

### Verifying Webhook Signature

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return signature === `sha256=${digest}`;
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { ApiClient } from './api-client';

const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key'
});

// Get resources
const resources = await client.resources.list({
  page: 1,
  limit: 20
});

// Create resource
const newResource = await client.resources.create({
  name: 'New Resource',
  description: 'Description'
});
```

### Python

```python
from api_client import ApiClient

client = ApiClient(
    base_url='https://api.example.com',
    api_key='your-api-key'
)

# Get resources
resources = client.resources.list(page=1, limit=20)

# Create resource
new_resource = client.resources.create(
    name='New Resource',
    description='Description'
)
```

### cURL

```bash
# List resources
curl -X GET https://api.example.com/api/resources \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create resource
curl -X POST https://api.example.com/api/resources \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Resource","description":"Description"}'
```

---

## Testing

### Testing with Postman

1. Import the Postman collection from `docs/postman_collection.json`
2. Set environment variables:
   - `BASE_URL` - API base URL
   - `TOKEN` - Your authentication token
3. Run the collection

### Testing with HTTPie

```bash
# Install HTTPie
pip install httpie

# List resources
http GET https://api.example.com/api/resources \
  Authorization:"Bearer YOUR_TOKEN"

# Create resource
http POST https://api.example.com/api/resources \
  Authorization:"Bearer YOUR_TOKEN" \
  name="New Resource" \
  description="Description"
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Authentication endpoints
- User management
- Resource CRUD operations

### v1.1.0 (TBD)
- Planned: Bulk operations
- Planned: Advanced search filters
- Planned: Webhook retry mechanism

---

**API Version:** 1.0.0
**Last Updated:** 2024-01-15
**Base URL:** https://api.example.com
