import { test, expect } from '@playwright/test';
import {
  httpGet,
  httpPost,
  httpPut,
  httpPatch,
  httpDelete,
  httpHead,
  httpGetWithParams,
  httpPostFormData,
  httpPostMultipart,
  httpRequestWithTimeout,
  validateStatusCode,
  getJsonResponse,
  getTextResponse,
  getResponseHeaders,
  isSuccessfulResponse,
  getStatusText,
  checkApiHealth,
  retryRequest,
  createCustomContext,
  getCurrentToken,
} from '../../../core/actions/api/apiActions';

test.describe('API Testing - Basic HTTP Methods', () => {
  test.skip('GET request example', async () => {
    const response = await httpGet('https://jsonplaceholder.typicode.com/posts/1');

    expect(isSuccessfulResponse(response)).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await getJsonResponse(response);
    console.log('GET response:', data);
    expect(data.id).toBe(1);
  });

  test.skip('POST request example', async () => {
    const payload = {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1,
    };

    const response = await httpPost(
      'https://jsonplaceholder.typicode.com/posts',
      payload
    );

    expect(validateStatusCode(response, 201)).toBeTruthy();

    const data = await getJsonResponse(response);
    console.log('POST response:', data);
    expect(data.title).toBe(payload.title);
  });

  test.skip('PUT request example', async () => {
    const payload = {
      id: 1,
      title: 'Updated Title',
      body: 'Updated body content',
      userId: 1,
    };

    const response = await httpPut(
      'https://jsonplaceholder.typicode.com/posts/1',
      payload
    );

    expect(response.ok()).toBeTruthy();
    const data = await getJsonResponse(response);
    console.log('PUT response:', data);
  });

  test.skip('PATCH request example', async () => {
    const payload = {
      title: 'Partially Updated Title',
    };

    const response = await httpPatch(
      'https://jsonplaceholder.typicode.com/posts/1',
      payload
    );

    expect(response.ok()).toBeTruthy();
    const data = await getJsonResponse(response);
    console.log('PATCH response:', data);
    expect(data.title).toBe(payload.title);
  });

  test.skip('DELETE request example', async () => {
    const response = await httpDelete(
      'https://jsonplaceholder.typicode.com/posts/1'
    );

    expect(response.ok()).toBeTruthy();
    console.log('DELETE status:', response.status());
  });

  test.skip('HEAD request example', async () => {
    const response = await httpHead('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.ok()).toBeTruthy();
    console.log('HEAD status:', response.status());
    console.log('Content-Type:', getResponseHeaders(response)['content-type']);
  });
});

test.describe('API Testing - Advanced Features', () => {
  test.skip('GET with query parameters', async () => {
    const params = {
      userId: 1,
      _limit: 5,
    };

    const response = await httpGetWithParams(
      'https://jsonplaceholder.typicode.com/posts',
      params
    );

    expect(response.ok()).toBeTruthy();
    const data = await getJsonResponse<Array<any>>(response);
    console.log(`Received ${data.length} posts`);
    expect(data.length).toBeLessThanOrEqual(5);
  });

  test.skip('POST with form data', async () => {
    const formData = {
      username: 'testuser',
      email: 'test@example.com',
      active: true,
    };

    const response = await httpPostFormData(
      'https://httpbin.org/post',
      formData
    );

    expect(response.ok()).toBeTruthy();
    const data = await getJsonResponse(response);
    console.log('Form data response:', data);
  });

  test.skip('Request with custom timeout', async () => {
    const response = await httpRequestWithTimeout('GET', 'https://httpbin.org/delay/2', {
      timeout: 5000, // 5 seconds
    });

    expect(response.ok()).toBeTruthy();
    console.log('Delayed request completed');
  });

  test.skip('Retry mechanism on failure', async () => {
    let attemptCount = 0;

    const response = await retryRequest(
      async () => {
        attemptCount++;
        console.log(`Attempt ${attemptCount}`);

        // Simulate occasional failure
        if (attemptCount < 2) {
          throw new Error('Simulated failure');
        }

        return await httpGet('https://jsonplaceholder.typicode.com/posts/1');
      },
      3, // max retries
      1000 // 1 second delay
    );

    expect(isSuccessfulResponse(response)).toBeTruthy();
    console.log(`Success after ${attemptCount} attempts`);
  });

  test.skip('Health check example', async () => {
    const isHealthy = await checkApiHealth('https://jsonplaceholder.typicode.com/posts/1');

    expect(isHealthy).toBeTruthy();
    console.log('API health status:', isHealthy ? 'Healthy' : 'Unhealthy');
  });
});

test.describe('API Testing - Response Validation', () => {
  test.skip('Validate status code', async () => {
    const response = await httpGet('https://jsonplaceholder.typicode.com/posts/999999');

    expect(validateStatusCode(response, 404)).toBeTruthy();
    console.log('Status text:', getStatusText(response));
  });

  test.skip('Extract and validate response headers', async () => {
    const response = await httpGet('https://jsonplaceholder.typicode.com/posts/1');

    const headers = getResponseHeaders(response);
    console.log('Response headers:', headers);

    expect(headers['content-type']).toContain('application/json');
  });

  test.skip('Get text response', async () => {
    const response = await httpGet('https://httpbin.org/html');

    const textContent = await getTextResponse(response);
    console.log('Text response length:', textContent.length);
    expect(textContent).toContain('html');
  });

  test.skip('Type-safe JSON response', async () => {
    interface Post {
      id: number;
      title: string;
      body: string;
      userId: number;
    }

    const response = await httpGet('https://jsonplaceholder.typicode.com/posts/1');
    const post = await getJsonResponse<Post>(response);

    console.log('Post ID:', post.id);
    console.log('Post Title:', post.title);

    expect(post.id).toBe(1);
    expect(typeof post.title).toBe('string');
  });
});

test.describe('API Testing - Custom Context', () => {
  test.skip('Create custom API context with base URL', async () => {
    const customContext = await createCustomContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      headers: {
        'X-Custom-Header': 'test-value',
      },
    });

    const response = await customContext.get('/posts/1');

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log('Custom context response:', data);

    await customContext.dispose();
  });
});

test.describe('API Testing - Authentication', () => {
  test('Check current JWT token', async () => {
    const token = await getCurrentToken();

    if (token) {
      console.log('JWT token is available');
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 20) + '...');
    } else {
      console.log('No JWT token found. Run token capture test first.');
    }
  });

  test.skip('Authenticated API request example', async () => {
    // Token is automatically loaded from .auth/tokens.json
    const response = await httpGet('https://api.example.com/protected-endpoint');

    expect(response.ok()).toBeTruthy();
    const data = await getJsonResponse(response);
    console.log('Authenticated response:', data);
  });
});

test.describe('API Testing - Error Handling', () => {
  test.skip('Handle 404 error', async () => {
    const response = await httpGet(
      'https://jsonplaceholder.typicode.com/posts/nonexistent'
    );

    expect(response.status()).toBe(404);
    expect(isSuccessfulResponse(response)).toBeFalsy();
    console.log('Error status:', response.status());
    console.log('Error text:', getStatusText(response));
  });

  test.skip('Handle network timeout', async () => {
    try {
      await httpRequestWithTimeout('GET', 'https://httpbin.org/delay/10', {
        timeout: 2000, // 2 seconds (request takes 10 seconds)
      });

      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      console.log('Timeout error caught as expected');
      expect(error).toBeDefined();
    }
  });

  test.skip('Validate error response structure', async () => {
    const response = await httpGet(
      'https://jsonplaceholder.typicode.com/posts/999999'
    );

    expect(response.status()).toBe(404);

    const errorData = await getJsonResponse(response);
    console.log('Error response:', errorData);
  });
});

test.describe('API Testing - Performance', () => {
  test.skip('Measure response time', async () => {
    const startTime = Date.now();

    const response = await httpGet('https://jsonplaceholder.typicode.com/posts/1');

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.ok()).toBeTruthy();
    console.log(`Response time: ${responseTime}ms`);

    // Assert response time is under 2 seconds
    expect(responseTime).toBeLessThan(2000);
  });

  test.skip('Concurrent API requests', async () => {
    const startTime = Date.now();

    const promises = [
      httpGet('https://jsonplaceholder.typicode.com/posts/1'),
      httpGet('https://jsonplaceholder.typicode.com/posts/2'),
      httpGet('https://jsonplaceholder.typicode.com/posts/3'),
      httpGet('https://jsonplaceholder.typicode.com/posts/4'),
      httpGet('https://jsonplaceholder.typicode.com/posts/5'),
    ];

    const responses = await Promise.all(promises);

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    responses.forEach((response, index) => {
      expect(response.ok()).toBeTruthy();
    });

    console.log(`5 concurrent requests completed in ${totalTime}ms`);
  });
});
