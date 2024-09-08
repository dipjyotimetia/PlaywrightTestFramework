import { test, expect } from "@playwright/test";
import { HttpGet, HttpPost, HttpPatch } from "../core/apiHelpers";

test.describe("API Tests", () => {
  test("GET request", async () => {
    const response = await HttpGet(
      "https://jsonplaceholder.typicode.com/posts/1",
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id", 1);
  });

  test("POST request", async () => {
    const postData = {
      title: "foo",
      body: "bar",
      userId: 1,
    };
    const response = await HttpPost(
      "https://jsonplaceholder.typicode.com/posts",
      postData,
    );
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("title", "foo");
    expect(responseBody).toHaveProperty("body", "bar");
    expect(responseBody).toHaveProperty("userId", 1);
  });

  test("PATCH request", async () => {
    const patchData = {
      title: "foo updated",
    };
    const response = await HttpPatch(
      "https://jsonplaceholder.typicode.com/posts/1",
      patchData,
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("title", "foo updated");
  });
});
