import { chromium, Browser, Page, ElementHandle } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
import { OpenAI } from 'openai';
import {config} from 'dotenv';
import {join} from 'path';
import { Configs, ElementInfo, ElementProperties } from './iface';

class WebsiteCrawler {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private openai: OpenAI;
  private config: Configs;

  constructor(config: Configs) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiBaseURL || 'https://api.deepseek.com',
      maxRetries: 2,
      timeout: 30000,
    });
  }

  private async generateSelectors(element: ElementHandle): Promise<{ css: string; playwright: string }> {
    const elementInfo = await element.evaluate((el: HTMLElement): ElementProperties => {
        const getAttrSafely = (attr: string): string | null => {
          try {
            return el.getAttribute(attr) || null;
          } catch {
            return null;
          }
        };
      
        return {
          tag: el.tagName?.toLowerCase() || 'unknown',
          id: el.id || null,
          classes: el.className || null,
          type: getAttrSafely('type'),
          name: getAttrSafely('name'),
          dataTestId: getAttrSafely('data-test-id'),
          value: getAttrSafely('value'),
          placeholder: getAttrSafely('placeholder'),
          ariaLabel: getAttrSafely('aria-label'),
          role: getAttrSafely('role')
        };
      }).catch(error => {
        console.error('Failed to evaluate element:', error);
        throw new Error('Element evaluation failed');
      });

    // Generate CSS selector
    const cssSelector = [
      elementInfo.tag,
      elementInfo.id ? `#${elementInfo.id}` : '',
      elementInfo.classes ? `.${elementInfo.classes.split(' ').join('.')}` : '',
    ].join('');

    // Generate Playwright selector
    const playwrightSelector = [
      elementInfo.dataTestId ? `[data-test-id="${elementInfo.dataTestId}"]` : '',
      elementInfo.id ? `#${elementInfo.id}` : '',
      elementInfo.name ? `[name="${elementInfo.name}"]` : '',
      elementInfo.type ? `[type="${elementInfo.type}"]` : '',
    ].filter(Boolean).join(' >> ') || elementInfo.tag;

    return { css: cssSelector, playwright: playwrightSelector };
  }

  private async validateWithAI(elementInfo: ElementInfo): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'deepseek-reasoner',
        messages: [{
          role: 'system',
          content: 'You are an expert in web automation and testing. Analyze the element information and provide feedback on selector quality.',
        }, {
          role: 'user',
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
            1. Selector reliability
            2. Best selector to use
            3. Potential improvements
          `
        }],
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0]?.message?.content || 'No AI feedback available';
    } catch (error) {
      console.error('AI validation error:', error);
      return 'AI validation failed';
    }
  }

  private async login(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(this.config.loginUrl);
    await this.page.waitForLoadState('networkidle');

    await this.page.fill("input[data-test='username']", "standard_user");
    await this.page.fill("input[data-test='password']", "secret_sauce");
    await this.page.click("input[data-test='login-button']");

    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
  }

  public async crawl(): Promise<ElementInfo[]> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        timeout: 30000,
      });
      this.page = await this.browser.newPage();

      await this.login();
      await this.page.goto(this.config.targetUrl);
      await this.page.waitForLoadState('networkidle');

      const elements = await this.page.$$('input, select, button, textarea, a[href]');
      const elementInfos: ElementInfo[] = [];

      for (const element of elements) {
        try {
          const { css, playwright } = await this.generateSelectors(element);
          const info: ElementInfo = {
            tag: await element.evaluate(el => el.tagName.toLowerCase()),
            type: (await element.getAttribute('type')) || '',
            name: (await element.getAttribute('name')) || '',
            id: (await element.getAttribute('id')) || '',
            class: (await element.getAttribute('class')) || '',
            dataTestId: (await element.getAttribute('data-test-id')) || '',
            cssSelector: css,
            playwrightSelector: playwright,
            description: '',
            aiValidation: ''
          };

          info.aiValidation = await this.validateWithAI(info);
          elementInfos.push(info);
        } catch (error) {
          console.error('Error processing element:', error);
        }
      }

      return elementInfos;
    } finally {
      await this.browser?.close();
    }
  }

  public async saveToCSV(elements: ElementInfo[], filename: string): Promise<void> {
    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: [
        { id: 'tag', title: 'Tag' },
        { id: 'type', title: 'Type' },
        { id: 'name', title: 'Name' },
        { id: 'id', title: 'ID' },
        { id: 'class', title: 'Class' },
        { id: 'dataTestId', title: 'Data-test-id' },
        { id: 'cssSelector', title: 'CSS Selector' },
        { id: 'playwrightSelector', title: 'Playwright Selector' },
        { id: 'description', title: 'Description' },
        { id: 'aiValidation', title: 'AI Validation' }
      ]
    });

    await csvWriter.writeRecords(elements);
  }
}

async function main() {
  config({ path: join(__dirname, '.env') });

  const requiredEnvVars = ['LOGIN_URL', 'USERNAME', 'PASSWORD', 'TARGET_URL', 'OPENAI_API_KEY'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  const configs: Configs = {
    loginUrl: process.env.LOGIN_URL!,
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
    targetUrl: process.env.TARGET_URL!,
    openaiApiKey: process.env.OPENAI_API_KEY!
  };

  try {
    const crawler = new WebsiteCrawler(configs);
    const elements = await crawler.crawl();
    await crawler.saveToCSV(elements, 'website_elements.csv');
    console.log('Crawling completed. Results saved to website_elements.csv');
  } catch (error) {
    console.error('Crawling failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { WebsiteCrawler, Configs, ElementInfo };