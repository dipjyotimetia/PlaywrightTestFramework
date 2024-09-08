import { BrowserContext, Page } from "@playwright/test";

// Function to mock an API call
/**
 * Mocks an API call by setting up a route in the provided context and fulfilling it with a specified response.
 * @param context - The browser context or page in which the API call should be mocked.
 * @param route - The route that should be intercepted and mocked.
 * @param response - The response object that should be sent back when the route is intercepted.
 */
export async function mockApiCall(
  context: BrowserContext | Page,
  route: string,
  response: any,
): Promise<void> {
  await context.route(route, (route) => {
    route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });
  });
}

// Function to mock an API response with a delay
/**
 * Mocks an API call with a specified delay before fulfilling the request.
 * @param context - The browser context or page in which the API call should be mocked.
 * @param route - The route that should be intercepted and mocked.
 * @param response - The response object that should be sent back when the route is intercepted.
 * @param delay - The delay in milliseconds before fulfilling the request.
 */
export async function mockApiCallWithDelay(
  context: BrowserContext | Page,
  route: string,
  response: any,
  delay: number,
): Promise<void> {
  await context.route(route, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });
  });
}

// Function to mock an API response not found
/**
 * Mocks an API call that returns a 404 status code (not found) in the provided browser context or page.
 * @param context - The browser context or page in which the API call should be mocked.
 * @param route - The route that should be intercepted and mocked.
 */
export async function mockApiCallNotFound(
  context: BrowserContext | Page,
  route: string,
): Promise<void> {
  await context.route(route, (route) => {
    route.fulfill({
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: "{}",
    });
  });
}

// Function to mock an API response with a header
/**
 * Mocks an API call by setting up a route in the provided browser context or page and fulfilling it with a specified response that includes a custom header.
 * @param context - The browser context or page in which the API call should be mocked.
 * @param route - The route that should be intercepted and mocked.
 * @param headerName - The name of the custom header to be included in the response.
 * @param headerValue - The value of the custom header to be included in the response.
 */
export async function mockApiCallWithHeader(
  context: BrowserContext | Page,
  route: string,
  headerName: string,
  headerValue: string,
): Promise<void> {
  await context.route(route, (route) => {
    route.fulfill({
      status: 200,
      headers: {
        [headerName]: headerValue,
      },
      body: "{}",
    });
  });
}
