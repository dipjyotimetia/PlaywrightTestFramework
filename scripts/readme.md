# Website Crawler (Playwright + optional AI)

This script logs in to a site, crawls common interactive elements, generates robust CSS/Playwright selectors, optionally validates them with an LLM, and saves results to CSV.

Files
- elements.ts: CLI and crawler implementation.
- iface.ts: TypeScript interfaces.
- .env.example: Example configuration.

Prerequisites
- Node.js 20+
- pnpm or npm
- Playwright dependencies installed (already covered by repo)

Environment Variables
Create scripts/.env (copy from .env.example):
- LOGIN_URL: Login page URL
- USERNAME: Login username
- PASSWORD: Login password
- TARGET_URL: Page to crawl after login
- OPENAI_API_KEY: Optional, enables AI selector validation
- OPENAI_BASE_URL: Optional, defaults to https://api.deepseek.com
- OPENAI_MODEL: Optional, defaults to deepseek-reasoner
- HEADLESS: Optional, true/false (default: true)
- CRAWL_CONCURRENCY: Optional, parallelism for element processing (default: 5)
- OUTPUT_CSV: Optional, output CSV path (default: website_elements.csv)

Run
- Using ts-node:
  - pnpm dlx ts-node scripts/elements.ts
  - or: npx ts-node scripts/elements.ts
- With environment:
  - OUTPUT_CSV=out/elements.csv CRAWL_CONCURRENCY=8 npx ts-node scripts/elements.ts

Output
A CSV file with:
- Tag, Type, Name, ID, Class, Data-test-id, CSS Selector, Playwright Selector, Description, AI Validation

Notes
- AI validation is skipped if OPENAI_API_KEY is not set.
- Selector priority: data-test(-id|id) > id > name > tag+classes. Playwright selector adds :has-text() for short button/link texts when no stable attrs are present.