import { existsSync, readFileSync }  from 'fs';
import { load } from 'js-yaml';

export interface config {
  baseUrl: string;
  baseUrlApi: string;
  endpoints: { name: string; path: string }[];
}

if (!existsSync('src/config/config.yaml')) {
  throw new Error('config.yaml file not found');
}
const config = load(readFileSync('src/config/config.yaml', 'utf8')) as config;

export const baseUrl: string = config.baseUrl;
export const baseUrlApi: string = config.baseUrlApi;
const endpoints = config.endpoints;

export const getEndpoint = (name: string) => endpoints.find((e) => e.name === name);
