import { test, expect } from '@playwright/test';
import { httpGet, httpPost, httpPatch ,httpDelete} from '../core/apiActions';
import { getEndpoint,baseUrlApi } from '../config/config';

test.describe('API Tests', () => {

  test('should get all posts', async () => {
    const endpoint = getEndpoint('getPosts');
    const response = await httpGet(`${baseUrlApi}${endpoint?.path}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.length).toBeGreaterThan(0);
    responseBody.forEach((post: any) => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
    });
  });

  test('should get a single post', async () => {
    const endpoint = getEndpoint('getPost');
    const response = await httpGet(`${baseUrlApi}${endpoint?.path.replace('{id}', '1')}`, {
      'Content-Type': 'application/json',
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id', 1);
    expect(responseBody).toHaveProperty('title');
    expect(responseBody).toHaveProperty('body');
    expect(responseBody).toHaveProperty('userId');
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
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.id).toBeGreaterThan(0);
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
    expect(responseBody).toHaveProperty('id', postId);
    expect(responseBody).toHaveProperty('body');
    expect(responseBody).toHaveProperty('userId');
  });

  test('should delete a post', async () => {
    const endpoint = getEndpoint('getPost');
    const postId = 1;
    const response = await httpDelete(`${baseUrlApi}${endpoint?.path.replace('{id}', postId.toString())}`);

    expect(response.status()).toBe(200);
  });

});