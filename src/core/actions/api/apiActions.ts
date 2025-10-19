import { APIRequestContext, request, test } from '@playwright/test';
import { TokenManager } from '../../auth/tokenManager';

let context: APIRequestContext;
const tokenManager = new TokenManager();

test.beforeAll(async () => {
  // Try to get JWT token from stored file first, fall back to env variable
  const storedToken = await tokenManager.getValidToken();
  const authToken = storedToken || process.env.API_TOKEN;

  const authHeader = authToken
    ? authToken.startsWith('Bearer ') || authToken.startsWith('token ')
      ? authToken
      : `Bearer ${authToken}`
    : '';

  context = await request.newContext({
    timeout: 30000,
    ignoreHTTPSErrors: true,
    maxRedirects: 10, // Control maximum redirects (Playwright v1.52+)
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authHeader && { Authorization: authHeader }),
    },
  });
});

test.afterAll(async () => {
  await context.dispose();
});

/**
 * Helper function to perform an HTTP GET request using Playwright.
 * @param url - The URL to send the GET request to.
 * @param headers - Optional headers to include in the request.
 * @returns The response from the GET request.
 */
export async function httpGet(url: string, headers?: Record<string, string>) {
  const response = await context.get(url, { headers });
  return response;
}

/**
 * Helper function to perform an HTTP POST request using Playwright.
 * @param url - The URL to send the POST request to.
 * @param data - The data to include in the POST request body.
 * @param headers - Optional headers to include in the request.
 * @returns The response from the POST request.
 */
export async function httpPost(
  url: string,
  data: any,
  headers?: Record<string, string>
) {
  const response = await context.post(url, { data, headers });
  return response;
}

/**
 * Helper function to perform an HTTP PATCH request using Playwright.
 * @param url - The URL to send the PATCH request to.
 * @param data - The data to include in the PATCH request body.
 * @param headers - Optional headers to include in the request.
 * @returns The response from the PATCH request.
 */
export async function httpPatch(
  url: string,
  data: any,
  headers?: Record<string, string>
) {
  const response = await context.patch(url, { data, headers });
  return response;
}

/**
 * Helper function to perform an HTTP PUT request using Playwright.
 * @param url - The URL to send the PUT request to.
 * @param data - The data to include in the PUT request body.
 * @param headers - Optional headers to include in the request.
 * @returns The response from the PUT request.
 */
export async function httpPut(
  url: string,
  data: any,
  headers?: Record<string, string>
) {
  const response = await context.put(url, { data, headers });
  return response;
}

/**
 *  Helper function to perform an HTTP DELETE request using Playwright.
 * @param url
 * @param headers
 * @returns
 */
export async function httpDelete(
  url: string,
  headers?: Record<string, string>
) {
  const response = await context.delete(url, { headers });
  return response;
}

/**
 * Helper function to get the current token being used for API requests.
 * @returns The current authorization token or null if not set.
 */
export async function getCurrentToken(): Promise<string | null> {
  return await tokenManager.getValidToken();
}

/**
 * Helper function to create a new API request context with a specific token.
 * Useful for testing with different tokens or when token needs to be refreshed.
 * @param token - The JWT token to use for authentication
 * @returns A new APIRequestContext with the specified token
 */
export async function createContextWithToken(
  token: string
): Promise<APIRequestContext> {
  const authHeader = token.startsWith('Bearer ')
    ? token
    : `Bearer ${token}`;

  return await request.newContext({
    timeout: 30000,
    ignoreHTTPSErrors: true,
    maxRedirects: 10,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
  });
}

/**
 * Helper function to perform HTTP HEAD request.
 * Useful for checking resource existence without downloading content.
 * @param url - The URL to send the HEAD request to
 * @param headers - Optional headers to include in the request
 * @returns The response from the HEAD request
 */
export async function httpHead(
  url: string,
  headers?: Record<string, string>
) {
  const response = await context.head(url, { headers });
  return response;
}

/**
 * Helper function to validate response status code.
 * @param response - The API response
 * @param expectedStatus - Expected status code
 * @returns true if status matches, false otherwise
 */
export function validateStatusCode(
  response: Awaited<ReturnType<typeof httpGet>>,
  expectedStatus: number
): boolean {
  return response.status() === expectedStatus;
}

/**
 * Helper function to extract JSON response body.
 * @param response - The API response
 * @returns Parsed JSON object
 */
export async function getJsonResponse<T = any>(
  response: Awaited<ReturnType<typeof httpGet>>
): Promise<T> {
  return await response.json();
}

/**
 * Helper function to extract text response body.
 * @param response - The API response
 * @returns Response body as text
 */
export async function getTextResponse(
  response: Awaited<ReturnType<typeof httpGet>>
): Promise<string> {
  return await response.text();
}

/**
 * Helper function to get response headers.
 * @param response - The API response
 * @returns Response headers object
 */
export function getResponseHeaders(
  response: Awaited<ReturnType<typeof httpGet>>
): Record<string, string> {
  return response.headers();
}

/**
 * Helper function to perform multipart form data POST request.
 * Useful for file uploads.
 * @param url - The URL to send the POST request to
 * @param formData - Form data to include
 * @param headers - Optional headers
 * @returns The response from the POST request
 */
export async function httpPostFormData(
  url: string,
  formData: Record<string, string | number | boolean>,
  headers?: Record<string, string>
) {
  const response = await context.post(url, {
    form: formData,
    headers,
  });
  return response;
}

/**
 * Helper function to perform multipart/form-data request with file upload.
 * @param url - The URL to send the POST request to
 * @param multipartData - Multipart form data
 * @param headers - Optional headers
 * @returns The response from the POST request
 */
export async function httpPostMultipart(
  url: string,
  multipartData: Record<string, any>,
  headers?: Record<string, string>
) {
  const response = await context.post(url, {
    multipart: multipartData,
    headers,
  });
  return response;
}

/**
 * Helper function to make API request with custom timeout.
 * @param method - HTTP method
 * @param url - Request URL
 * @param options - Request options including timeout
 * @returns The response
 */
export async function httpRequestWithTimeout(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options: {
    data?: any;
    headers?: Record<string, string>;
    timeout?: number;
  } = {}
) {
  const { data, headers, timeout = 30000 } = options;

  const response = await context.fetch(url, {
    method,
    data,
    headers,
    timeout,
  });

  return response;
}

/**
 * Helper function to make a request with query parameters.
 * @param url - Base URL
 * @param params - Query parameters
 * @param headers - Optional headers
 * @returns The response from the GET request
 */
export async function httpGetWithParams(
  url: string,
  params: Record<string, string | number | boolean>,
  headers?: Record<string, string>
) {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, String(value));
  });

  return await httpGet(urlObj.toString(), headers);
}

/**
 * Helper function to check if response is successful (2xx status).
 * @param response - The API response
 * @returns true if response is successful
 */
export function isSuccessfulResponse(
  response: Awaited<ReturnType<typeof httpGet>>
): boolean {
  return response.ok();
}

/**
 * Helper function to get response status text.
 * @param response - The API response
 * @returns Status text (e.g., "OK", "Not Found")
 */
export function getStatusText(
  response: Awaited<ReturnType<typeof httpGet>>
): string {
  return response.statusText();
}

/**
 * Helper function to perform API health check.
 * @param healthCheckUrl - Health check endpoint URL
 * @returns true if service is healthy
 */
export async function checkApiHealth(healthCheckUrl: string): Promise<boolean> {
  try {
    const response = await httpGet(healthCheckUrl);
    return response.ok();
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to retry API request on failure.
 * @param requestFn - Function that makes the API request
 * @param maxRetries - Maximum number of retry attempts
 * @param retryDelay - Delay between retries in milliseconds
 * @returns The successful response
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

/**
 * Helper function to create API request context with custom configuration.
 * @param config - Custom configuration for the API context
 * @returns A new APIRequestContext
 */
export async function createCustomContext(config: {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  ignoreHTTPSErrors?: boolean;
}): Promise<APIRequestContext> {
  return await request.newContext({
    timeout: config.timeout || 30000,
    ignoreHTTPSErrors: config.ignoreHTTPSErrors ?? true,
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });
}
