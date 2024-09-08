import { APIRequestContext, request, test } from '@playwright/test';

let context: APIRequestContext;

test.beforeAll(async () => {
  context = await request.newContext({
    timeout: 30000,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `token ${process.env.API_TOKEN}`,
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
