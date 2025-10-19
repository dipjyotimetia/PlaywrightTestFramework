import { chromium, Browser, Page, ElementHandle } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
import { OpenAI } from 'openai';
import { config as loadEnv } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Configs, ElementInfo, ElementProperties } from './iface';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function ensureDirSync(path: string): void {
  const dir = fs.existsSync(path) && fs.lstatSync(path).isDirectory()
    ? path
    : dirname(path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cssEscape(value: string): string {
  // Escape special CSS characters
  return value.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, `\\$1`);
}

function quote(value: string): string {
  return value.replace(/"/g, `\\"`);
}

function pickBestTestId(props: ElementProperties): { attr?: string; value?: string } {
  if (props.dataTestId) return { attr: `data-test-id`, value: props.dataTestId };
  if (props.dataTestIdStd) return { attr: `data-testid`, value: props.dataTestIdStd };
  if (props.dataTest) return { attr: `data-test`, value: props.dataTest };
  return {};
}

function buildCssSelector(props: ElementProperties): string {
  // Priority: test-id attrs > id > name > tag+class
  const testId = pickBestTestId(props);
  if (testId.attr && testId.value) {
    return `[${testId.attr}="${quote(testId.value)}"]`;
  }

  if (props.id) {
    return `#${cssEscape(props.id)}`;
  }

  if (props.name) {
    return `${props.tag}[name="${quote(props.name)}"]`;
  }

  const classes = (props.classes || ``)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(c => `.${cssEscape(c)}`)
    .join(``);

  return classes ? `${props.tag}${classes}` : props.tag;
}

function buildPlaywrightSelector(props: ElementProperties): string {
  const css = buildCssSelector(props);

  // If button/link with short visible text and no test-id/id, add :has-text() as a hint
  const hasStableAttr =
    !!props.id ||
    !!props.dataTest ||
    !!props.dataTestId ||
    !!props.dataTestIdStd ||
    !!props.name;

  if (!hasStableAttr && props.text && props.text.trim().length > 0 && props.text.trim().length <= 40) {
    const safeText = props.text.trim().replace(/\s+/g, ` `);
    return `${css}:has-text("${quote(safeText)}")`;
  }

  return css;
}

class WebsiteCrawler {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private openai: OpenAI | null = null;
  private config: Configs;

  constructor(config: Configs) {
    this.config = config;
    if (config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: config.openaiApiKey,
        baseURL: config.openaiBaseURL || process.env.OPENAI_BASE_URL || `https://api.deepseek.com`,
        maxRetries: 2,
        timeout: 30000,
      });
    }
  }

  private async generateSelectors(element: ElementHandle): Promise<{ css: string; playwright: string; dataTestIdResolved: string }> {
    const elementInfo = await element
      .evaluate((el: HTMLElement): ElementProperties => {
        const getAttrSafely = (attr: string): string | null => {
          try {
            return el.getAttribute(attr) || null;
          } catch {
            return null;
          }
        };

        const text =
          (el.tagName.toLowerCase() === `button` || el.tagName.toLowerCase() === `a`)
            ? (el.textContent || ``).trim()
            : ``;

        return {
          tag: el.tagName?.toLowerCase() || `unknown`,
          id: el.id || null,
          classes: el.className || null,
          type: getAttrSafely(`type`),
          name: getAttrSafely(`name`),
          dataTestId: getAttrSafely(`data-test-id`),
          dataTest: getAttrSafely(`data-test`),
          dataTestIdStd: getAttrSafely(`data-testid`),
          value: getAttrSafely(`value`),
          placeholder: getAttrSafely(`placeholder`),
          ariaLabel: getAttrSafely(`aria-label`),
          role: getAttrSafely(`role`),
          text,
        };
      })
      .catch(error => {
        console.error(`Failed to evaluate element:`, error);
        throw new Error(`Element evaluation failed`);
      });

    const css = buildCssSelector(elementInfo);
    const playwright = buildPlaywrightSelector(elementInfo);

    const bestTestId = pickBestTestId(elementInfo);
    const dataTestIdResolved = bestTestId.value || ``;

    return { css, playwright, dataTestIdResolved };
  }

  private async validateWithAI(elementInfo: ElementInfo): Promise<string> {
    if (!this.openai) {
      return `AI validation skipped (no OPENAI_API_KEY)`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || `deepseek-reasoner`,
        messages: [
          {
            role: `system`,
            content: `You are an expert in web automation and testing. Analyze the element information and provide feedback on selector quality.`,
          },
          {
            role: `user`,
            content: `
Analyze this web element and its selectors:
Tag: ${elementInfo.tag}
Type: ${elementInfo.type}
Name: ${elementInfo.name}
ID: ${elementInfo.id}
Class: ${elementInfo.class}
Data-test-id: ${elementInfo.dataTestId}
CSS Selector: ${elementInfo.cssSelector}
Playwright Selector: ${elementInfo.playwrightSelector}

Provide brief feedback on:
1) Selector reliability
2) Best selector to use
3) Potential improvements
            `.trim(),
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      return response.choices[0]?.message?.content || `No AI feedback available`;
    } catch (error) {
      console.error(`AI validation error:`, error);
      return `AI validation failed`;
    }
  }

  private async login(): Promise<void> {
    if (!this.page) throw new Error(`Page not initialized`);

    await this.page.goto(this.config.loginUrl, { waitUntil: `domcontentloaded` });
    await this.page.waitForLoadState(`networkidle`);

    await this.page.fill(`input[data-test="username"]`, this.config.username);
    await this.page.fill(`input[data-test="password"]`, this.config.password);
    await this.page.click(`input[data-test="login-button"]`);

    await this.page.waitForLoadState(`networkidle`);
  }

  public async crawl(): Promise<ElementInfo[]> {
    const headless = (process.env.HEADLESS ?? `true`).toLowerCase() !== `false`;
    const concurrency = Math.max(1, Number(process.env.CRAWL_CONCURRENCY ?? `5`));

    try {
      this.browser = await chromium.launch({
        headless,
        timeout: 30000,
      });
      this.page = await this.browser.newPage();
      this.page.setDefaultTimeout(30000);

      await this.login();
      await this.page.goto(this.config.targetUrl, { waitUntil: `domcontentloaded` });
      await this.page.waitForLoadState(`networkidle`);

      const elements = await this.page.$$(`input, select, button, textarea, a[href]`);
      const elementInfos: ElementInfo[] = [];

      const seen = new Set<string>();

      // Simple concurrency control
      let index = 0;
      const worker = async () => {
        while (index < elements.length) {
          const i = index++;
          const element = elements[i];
          try {
            const { css, playwright, dataTestIdResolved } = await this.generateSelectors(element);

            const key = `${css}||${playwright}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const info: ElementInfo = {
              tag: await element.evaluate(el => el.tagName.toLowerCase()),
              type: (await element.getAttribute(`type`)) || ``,
              name: (await element.getAttribute(`name`)) || ``,
              id: (await element.getAttribute(`id`)) || ``,
              class: (await element.getAttribute(`class`)) || ``,
              dataTestId: dataTestIdResolved,
              cssSelector: css,
              playwrightSelector: playwright,
              description: ``,
              aiValidation: ``,
            };

            info.aiValidation = await this.validateWithAI(info);
            elementInfos.push(info);
          } catch (error) {
            console.error(`Error processing element:`, error);
          }
        }
      };

      await Promise.all(Array.from({ length: concurrency }, () => worker()));
      return elementInfos;
    } finally {
      await this.browser?.close();
    }
  }

  public async saveToCSV(elements: ElementInfo[], filename: string): Promise<void> {
    ensureDirSync(filename);

    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: [
        { id: `tag`, title: `Tag` },
        { id: `type`, title: `Type` },
        { id: `name`, title: `Name` },
        { id: `id`, title: `ID` },
        { id: `class`, title: `Class` },
        { id: `dataTestId`, title: `Data-test-id` },
        { id: `cssSelector`, title: `CSS Selector` },
        { id: `playwrightSelector`, title: `Playwright Selector` },
        { id: `description`, title: `Description` },
        { id: `aiValidation`, title: `AI Validation` },
      ],
      alwaysQuote: true,
    });

    await csvWriter.writeRecords(elements);
  }
}

async function main() {
  // Load scripts-local .env first; fall back to repo root .env
  const localEnv = join(__dirname, `.env`);
  if (fs.existsSync(localEnv)) {
    loadEnv({ path: localEnv });
  } else {
    loadEnv(); // default
  }

  const requiredEnv = [`LOGIN_URL`, `USERNAME`, `PASSWORD`, `TARGET_URL`];
  const missing = requiredEnv.filter(v => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(`, `)}`);
  }

  const configs: Configs = {
    loginUrl: process.env.LOGIN_URL!,
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
    targetUrl: process.env.TARGET_URL!,
    openaiApiKey: process.env.OPENAI_API_KEY, // optional
    openaiBaseURL: process.env.OPENAI_BASE_URL, // optional
  };

  const output = process.env.OUTPUT_CSV || `website_elements.csv`;

  try {
    const crawler = new WebsiteCrawler(configs);
    const elements = await crawler.crawl();
    await crawler.saveToCSV(elements, output);
    console.log(`Crawling completed. Results saved to ${output}`);
  } catch (error) {
    console.error(`Crawling failed:`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}

export { WebsiteCrawler, Configs, ElementInfo };