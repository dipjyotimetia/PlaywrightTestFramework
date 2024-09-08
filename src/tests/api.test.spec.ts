import { test, expect } from '@playwright/test';
import { httpGet, httpPost, httpPatch ,httpDelete} from '../core/apiHelpers';
import { getEndpoint,baseUrlApi } from '../config/config';


test.describe('API Tests', () => {
  test('should get all posts', async () => {
    const endpoint = getEndpoint('getPosts');
    const response = await httpGet(`${baseUrlApi}${endpoint?.path}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.length).toBeGreaterThan(0);
  });

  test('should get a single post', async () => {
    const endpoint = getEndpoint('getPost');
    const response = await httpGet(`${baseUrlApi}${endpoint?.path.replace('{id}', '1')}`, {
      'Content-Type': 'application/json',
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id', 1);
  });

  test('should create a new post', async () => {
    const endpoint = getEndpoint('createPost');
    const requestBody = {
      title: "foo",
      body: "bar",
      userId: 1
    };

    const response = await httpPost(`${baseUrlApi}${endpoint?.path}`, requestBody);

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('title', 'foo');
    expect(responseBody).toHaveProperty('body', 'bar');
    expect(responseBody).toHaveProperty('userId', 1);
  });

  test('should update a post', async () => {
    const endpoint = getEndpoint('getPost');
    const postId = 1;
    const requestBody = {
      title: "updated title"
    };

    const response = await httpPatch(`${baseUrlApi}${endpoint?.path.replace('{id}', postId.toString())}`, requestBody);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('title', 'updated title');
  });

  test('should delete a post', async () => {
    const endpoint = getEndpoint('getPost'); 
    const postId = 1;

    const response = await httpDelete(`${baseUrlApi}${endpoint?.path.replace('{id}', postId.toString())}`);
    expect(response.status()).toBe(200);
  });

});
