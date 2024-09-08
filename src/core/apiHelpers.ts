import { APIRequestContext, request } from '@playwright/test';

/**
 * Helper function to perform an HTTP GET request using Playwright.
 * @param url - The URL to send the GET request to.
 * @param headers - Optional headers to include in the request.
 * @returns The response from the GET request.
 */
export async function HttpGet(url: string, headers?: Record<string, string>) {
  const context: APIRequestContext = await request.newContext();
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
export async function HttpPost(url: string, data: any, headers?: Record<string, string>) {
  const context: APIRequestContext = await request.newContext();
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
export async function HttpPatch(url: string, data: any, headers?: Record<string, string>) {
  const context: APIRequestContext = await request.newContext();
  const response = await context.patch(url, { data, headers });
  return response;
}
