# API Functions Reference Guide

Complete reference for all API testing functions in `src/core/apiActions.ts`.

## Table of Contents
1. [HTTP Methods](#http-methods)
2. [Response Utilities](#response-utilities)
3. [Form Data & Multipart](#form-data--multipart)
4. [Advanced Features](#advanced-features)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)

---

## HTTP Methods

### Basic HTTP Requests

#### `httpGet(url, headers?)`
Performs an HTTP GET request.

```typescript
const response = await httpGet('https://api.example.com/users/1');
const data = await response.json();
```

#### `httpPost(url, data, headers?)`
Performs an HTTP POST request with JSON data.

```typescript
const payload = { name: 'John', email: 'john@example.com' };
const response = await httpPost('https://api.example.com/users', payload);
```

#### `httpPut(url, data, headers?)`
Performs an HTTP PUT request to update a resource.

```typescript
const updatedUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
const response = await httpPut('https://api.example.com/users/1', updatedUser);
```

#### `httpPatch(url, data, headers?)`
Performs an HTTP PATCH request for partial updates.

```typescript
const updates = { email: 'newemail@example.com' };
const response = await httpPatch('https://api.example.com/users/1', updates);
```

#### `httpDelete(url, headers?)`
Performs an HTTP DELETE request.

```typescript
const response = await httpDelete('https://api.example.com/users/1');
```

#### `httpHead(url, headers?)`
Performs an HTTP HEAD request (useful for checking resource existence).

```typescript
const response = await httpHead('https://api.example.com/users/1');
console.log('Content-Type:', response.headers()['content-type']);
```

---

## Response Utilities

### `validateStatusCode(response, expectedStatus)`
Checks if response status matches expected code.

```typescript
const response = await httpGet('https://api.example.com/users/1');
expect(validateStatusCode(response, 200)).toBeTruthy();
```

### `getJsonResponse<T>(response)`
Extracts and parses JSON response body with type safety.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const response = await httpGet('https://api.example.com/users/1');
const user = await getJsonResponse<User>(response);
console.log(user.name); // TypeScript knows this is a string
```

### `getTextResponse(response)`
Extracts response body as plain text.

```typescript
const response = await httpGet('https://api.example.com/readme');
const text = await getTextResponse(response);
console.log(text);
```

### `getResponseHeaders(response)`
Gets all response headers.

```typescript
const response = await httpGet('https://api.example.com/users/1');
const headers = getResponseHeaders(response);
console.log('Content-Type:', headers['content-type']);
console.log('Cache-Control:', headers['cache-control']);
```

### `isSuccessfulResponse(response)`
Checks if response has 2xx status code.

```typescript
const response = await httpGet('https://api.example.com/users/1');
if (isSuccessfulResponse(response)) {
  console.log('Success!');
}
```

### `getStatusText(response)`
Gets HTTP status text (e.g., "OK", "Not Found").

```typescript
const response = await httpGet('https://api.example.com/users/999');
console.log(getStatusText(response)); // "Not Found"
```

---

## Form Data & Multipart

### `httpPostFormData(url, formData, headers?)`
Sends POST request with form data (application/x-www-form-urlencoded).

```typescript
const formData = {
  username: 'testuser',
  password: 'secret123',
  remember: true,
};

const response = await httpPostFormData('https://api.example.com/login', formData);
```

### `httpPostMultipart(url, multipartData, headers?)`
Sends POST request with multipart/form-data (useful for file uploads).

```typescript
const multipartData = {
  file: {
    name: 'document.pdf',
    mimeType: 'application/pdf',
    buffer: fileBuffer,
  },
  title: 'My Document',
  description: 'Important file',
};

const response = await httpPostMultipart(
  'https://api.example.com/upload',
  multipartData
);
```

---

## Advanced Features

### `httpGetWithParams(url, params, headers?)`
GET request with query parameters.

```typescript
const params = {
  page: 2,
  limit: 20,
  sort: 'created_at',
  order: 'desc',
};

const response = await httpGetWithParams(
  'https://api.example.com/posts',
  params
);
// Requests: https://api.example.com/posts?page=2&limit=20&sort=created_at&order=desc
```

### `httpRequestWithTimeout(method, url, options)`
Make request with custom timeout.

```typescript
const response = await httpRequestWithTimeout('GET', 'https://api.example.com/slow-endpoint', {
  timeout: 10000, // 10 seconds
  data: null,
  headers: { 'X-Custom': 'value' },
});
```

### `retryRequest(requestFn, maxRetries, retryDelay)`
Retry failed requests automatically.

```typescript
const response = await retryRequest(
  async () => await httpGet('https://api.example.com/unstable-endpoint'),
  3,    // max 3 retries
  1000  // 1 second delay between retries
);
```

### `checkApiHealth(healthCheckUrl)`
Check if API endpoint is healthy.

```typescript
const isHealthy = await checkApiHealth('https://api.example.com/health');
if (!isHealthy) {
  console.error('API is down!');
}
```

### `createCustomContext(config)`
Create API context with custom configuration.

```typescript
const customContext = await createCustomContext({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  headers: {
    'X-API-Version': 'v2',
    'X-Client': 'playwright-tests',
  },
  ignoreHTTPSErrors: true,
});

// Use relative URLs with base URL
const response = await customContext.get('/users/1');
await customContext.dispose();
```

---

## Authentication

### `getCurrentToken()`
Get currently loaded JWT token.

```typescript
const token = await getCurrentToken();
if (token) {
  console.log('Token is loaded:', token.substring(0, 20) + '...');
} else {
  console.log('No token available');
}
```

### `createContextWithToken(token)`
Create API context with specific JWT token.

```typescript
const customToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const context = await createContextWithToken(customToken);

const response = await context.get('https://api.example.com/protected');
await context.dispose();
```

### Automatic Token Loading

JWT tokens are automatically loaded from `.auth/tokens.json` in the `beforeAll` hook. No manual configuration needed!

```typescript
test('authenticated request', async () => {
  // Token automatically loaded!
  const response = await httpGet('https://api.example.com/user/profile');
  expect(response.ok()).toBeTruthy();
});
```

---

## Error Handling

### Handle Specific Status Codes

```typescript
const response = await httpGet('https://api.example.com/users/999');

switch (response.status()) {
  case 200:
    console.log('Success');
    break;
  case 404:
    console.log('User not found');
    break;
  case 401:
    console.log('Unauthorized - refresh token');
    break;
  case 500:
    console.log('Server error');
    break;
}
```

### Try-Catch for Network Errors

```typescript
try {
  const response = await httpRequestWithTimeout(
    'GET',
    'https://api.example.com/data',
    { timeout: 5000 }
  );

  if (!isSuccessfulResponse(response)) {
    console.error('Request failed:', getStatusText(response));
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### Retry on Specific Errors

```typescript
const response = await retryRequest(async () => {
  const res = await httpGet('https://api.example.com/data');

  if (res.status() === 503) {
    throw new Error('Service unavailable, retrying...');
  }

  return res;
}, 5, 2000);
```

---

## Complete Usage Examples

### Example 1: CRUD Operations

```typescript
test.describe('User CRUD API Tests', () => {
  let userId: number;

  test('Create user', async () => {
    const newUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'admin',
    };

    const response = await httpPost('https://api.example.com/users', newUser);
    expect(validateStatusCode(response, 201)).toBeTruthy();

    const user = await getJsonResponse(response);
    userId = user.id;
  });

  test('Read user', async () => {
    const response = await httpGet(`https://api.example.com/users/${userId}`);
    expect(isSuccessfulResponse(response)).toBeTruthy();

    const user = await getJsonResponse(response);
    expect(user.email).toBe('jane@example.com');
  });

  test('Update user', async () => {
    const updates = { role: 'superadmin' };
    const response = await httpPatch(`https://api.example.com/users/${userId}`, updates);

    expect(response.ok()).toBeTruthy();
  });

  test('Delete user', async () => {
    const response = await httpDelete(`https://api.example.com/users/${userId}`);
    expect(validateStatusCode(response, 204)).toBeTruthy();
  });
});
```

### Example 2: Search with Filters

```typescript
test('Search posts with filters', async () => {
  const filters = {
    category: 'technology',
    status: 'published',
    page: 1,
    limit: 10,
    sort: 'created_at',
  };

  const response = await httpGetWithParams(
    'https://api.example.com/posts',
    filters
  );

  expect(response.ok()).toBeTruthy();

  const posts = await getJsonResponse<Array<Post>>(response);
  console.log(`Found ${posts.length} posts`);

  posts.forEach(post => {
    expect(post.category).toBe('technology');
    expect(post.status).toBe('published');
  });
});
```

### Example 3: File Upload

```typescript
test('Upload file with metadata', async () => {
  const multipartData = {
    file: {
      name: 'report.pdf',
      mimeType: 'application/pdf',
      buffer: await fs.readFile('test-files/report.pdf'),
    },
    title: 'Q4 Financial Report',
    category: 'finance',
    visibility: 'private',
  };

  const response = await httpPostMultipart(
    'https://api.example.com/documents',
    multipartData
  );

  expect(validateStatusCode(response, 201)).toBeTruthy();

  const document = await getJsonResponse(response);
  console.log('Document uploaded:', document.id);
});
```

### Example 4: Performance Testing

```typescript
test('API response time should be under 500ms', async () => {
  const startTime = Date.now();

  const response = await httpGet('https://api.example.com/dashboard');

  const responseTime = Date.now() - startTime;

  expect(response.ok()).toBeTruthy();
  expect(responseTime).toBeLessThan(500);

  console.log(`Response time: ${responseTime}ms`);
});

test('Handle concurrent requests', async () => {
  const endpoints = [
    '/users/1',
    '/users/2',
    '/users/3',
    '/users/4',
    '/users/5',
  ];

  const promises = endpoints.map(endpoint =>
    httpGet(`https://api.example.com${endpoint}`)
  );

  const responses = await Promise.all(promises);

  responses.forEach(response => {
    expect(isSuccessfulResponse(response)).toBeTruthy();
  });

  console.log('All concurrent requests succeeded');
});
```

---

## Best Practices

1. **Always validate response status**
   ```typescript
   const response = await httpGet(url);
   expect(isSuccessfulResponse(response)).toBeTruthy();
   ```

2. **Use type-safe JSON responses**
   ```typescript
   interface User { id: number; name: string; }
   const user = await getJsonResponse<User>(response);
   ```

3. **Handle errors gracefully**
   ```typescript
   try {
     const response = await retryRequest(() => httpGet(url), 3, 1000);
   } catch (error) {
     console.error('All retries failed:', error);
   }
   ```

4. **Check API health before tests**
   ```typescript
   test.beforeAll(async () => {
     const isHealthy = await checkApiHealth('https://api.example.com/health');
     if (!isHealthy) {
       throw new Error('API is not healthy, skipping tests');
     }
   });
   ```

5. **Use custom contexts for different environments**
   ```typescript
   const prodContext = await createCustomContext({
     baseURL: 'https://api.production.com',
     headers: { 'X-Environment': 'production' },
   });
   ```

---

## Summary of All Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `httpGet` | GET request | Response |
| `httpPost` | POST request | Response |
| `httpPut` | PUT request | Response |
| `httpPatch` | PATCH request | Response |
| `httpDelete` | DELETE request | Response |
| `httpHead` | HEAD request | Response |
| `httpGetWithParams` | GET with query params | Response |
| `httpPostFormData` | POST form data | Response |
| `httpPostMultipart` | POST multipart/form-data | Response |
| `httpRequestWithTimeout` | Request with custom timeout | Response |
| `validateStatusCode` | Check status code | boolean |
| `getJsonResponse` | Parse JSON response | T (generic) |
| `getTextResponse` | Get text response | string |
| `getResponseHeaders` | Get all headers | Record<string, string> |
| `isSuccessfulResponse` | Check 2xx status | boolean |
| `getStatusText` | Get status text | string |
| `checkApiHealth` | Health check | boolean |
| `retryRequest` | Retry on failure | T (generic) |
| `getCurrentToken` | Get JWT token | string \| null |
| `createContextWithToken` | Context with specific token | APIRequestContext |
| `createCustomContext` | Custom API context | APIRequestContext |

---

For more examples, see `src/tests/api-examples.test.spec.ts`.
