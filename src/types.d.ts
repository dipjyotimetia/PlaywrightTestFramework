// global.d.ts

import { Browser, Page } from '@playwright/test';

declare global {
  const page: Page;
  const browser: Browser;
  const browserName: string;
}
