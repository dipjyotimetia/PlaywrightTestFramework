import { BrowserContext, Page } from '@playwright/test';

// Function to mock an API call
export async function mockApiCall(context: BrowserContext | Page, route: string, response: any): Promise<void> {
    await context.route(route, (route) => {
        // Set the response status and body
        route.fulfill({
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
        });
    });
}

// Function to mock an API response with a delay
export async function mockApiCallWithDelay(
    context: BrowserContext | Page,
    route: string,
    response: any,
    delay: number
): Promise<void> {
    await context.route(route, (route) => {
        // Set a delay before fulfilling the request
        setTimeout(() => {
            route.fulfill({
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(response)
            });
        }, delay);
    });
}

// Function to mock an API response not found
export async function mockApiCallNotFound(
    context: BrowserContext | Page,
    route: string
): Promise<void> {
    await context.route(route, (route) => {
        route.fulfill({
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{}'
        });
    });
}


// Function to mock an API response with a header
export async function mockApiCallWithHeader(
    context: BrowserContext | Page,
    route: string,
    headerName: string,
    headerValue: string
): Promise<void> {
    await context.route(route, (route) => {
        route.fulfill({
            status: 200,
            headers: {
                [headerName]: headerValue
            },
            body: '{}'
        });
    });
}