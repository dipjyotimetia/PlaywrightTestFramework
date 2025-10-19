import { chromium, Browser, Page, ElementHandle } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
import { OpenAI } from 'openai';
import { config } from 'dotenv';
import { join } from 'path';
import { Configs, ElementInfo, ElementProperties, LLMProvider } from './iface';

class WebsiteCrawler {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private openai: OpenAI;
  private readonly config: Configs;
  private readonly batchSize = 5; // Process elements in batches

  constructor(config: Configs) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiBaseURL || 'https://api.deepseek.com',
      maxRetries: 3,
      timeout: 60000,
    });
  }


  /**
   * Returns the default base URL for the specified LLM provider
   */
  private getDefaultBaseURL(provider?: LLMProvider): string {
    switch (provider) {
      case 'deepseek':
        return 'https://api.deepseek.com';
      case 'anthropic':
        return 'https://api.anthropic.com';
      case 'cohere':
        return 'https://api.cohere.ai/v1';
      case 'azure':
        return this.config.azureEndpoint || '';
      case 'openai':
      default:
        return 'https://api.openai.com/v1';
    }
  }

  /**
   * Get the appropriate model name based on the provider
   */
  private getLLMModel(): string {
    switch (this.config.llmProvider) {
      case 'deepseek':
        return 'deepseek-reasoner';
      case 'anthropic':
        return 'claude-3-5-sonnet-20240620';
      case 'cohere':
        return 'command-r-plus';
      case 'azure':
        return this.config.azureModelName || 'gpt-4';
      case 'openai':
      default:
        return 'gpt-4o';
    }
  }

  private async extractElementProperties(element: ElementHandle): Promise<ElementProperties> {
    return element.evaluate((el: HTMLElement): ElementProperties => {
      const getAttrSafely = (attr: string): string | null => {
        try { return el.getAttribute(attr) || null; } catch { return null; }
      };

      return {
        tag: el.tagName?.toLowerCase() || 'unknown',
        id: el.id || null,
        classes: el.className || null,
        type: getAttrSafely('type'),
        name: getAttrSafely('name'),
        dataTestId: getAttrSafely('data-test-id') || getAttrSafely('data-testid') || getAttrSafely('data-test'),
        value: getAttrSafely('value'),
        placeholder: getAttrSafely('placeholder'),
        ariaLabel: getAttrSafely('aria-label'),
        role: getAttrSafely('role')
      };
    }).catch(error => {
      console.error('Failed to evaluate element:', error);
      throw new Error('Element evaluation failed');
    });
  }

  private generateSelectors(elementInfo: ElementProperties): { css: string; playwright: string } {
    // Generate CSS selector - more compact
    const cssSelector = [
      elementInfo.tag,
      elementInfo.id ? `#${elementInfo.id}` : '',
      elementInfo.classes ? `.${elementInfo.classes.split(' ').join('.')}` : '',
    ].filter(Boolean).join('');

    // Generate prioritized Playwright selector
    const selectorParts: string[] = [];

    // Prioritize data-test attributes
    if (elementInfo.dataTestId) {
      selectorParts.push(`[data-test-id="${elementInfo.dataTestId}"], [data-testid="${elementInfo.dataTestId}"], [data-test="${elementInfo.dataTestId}"]`);
    }

    // Then ID (unique)
    if (elementInfo.id) {
      selectorParts.push(`#${elementInfo.id}`);
    }

    // Then other attributes
    if (elementInfo.name) selectorParts.push(`[name="${elementInfo.name}"]`);
    if (elementInfo.type) selectorParts.push(`[type="${elementInfo.type}"]`);

    // Use role and aria when available
    if (elementInfo.role) selectorParts.push(`[role="${elementInfo.role}"]`);
    if (elementInfo.ariaLabel) selectorParts.push(`[aria-label="${elementInfo.ariaLabel}"]`);

    const playwrightSelector = selectorParts.length > 0
      ? selectorParts.join(' >> ')
      : elementInfo.tag;

    return { css: cssSelector, playwright: playwrightSelector };
  }

  private async validateElementsWithAI(elements: ElementInfo[]): Promise<Record<number, string>> {
    try {
      const elementsForAI = elements.map((el, idx) => `
Element ${idx + 1}:
- Tag: ${el.tag}
- Type: ${el.type || 'N/A'}
- Name: ${el.name || 'N/A'}
- ID: ${el.id || 'N/A'} 
- Class: ${el.class || 'N/A'}
- Data-test-id: ${el.dataTestId || 'N/A'}
- CSS: ${el.cssSelector}
- Playwright: ${el.playwrightSelector}
      `).join('\n');

      const response = await this.openai.chat.completions.create({
        model: this.getLLMModel(),
        messages: [{
          role: 'system',
          content: 'You are an expert in web automation and testing. Analyze element information and provide feedback on selector quality.'
        }, {
          role: 'user',
          content: `Analyze these web elements and their selectors. For each element, provide brief feedback on:
1. Selector reliability (1-5 scale)
2. Best selector approach
3. Brief improvement suggestions if needed

${elementsForAI}`
        }],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '';

      // Parse AI response and map back to elements
      const resultMap: Record<number, string> = {};
      const elementMatches = [...content.matchAll(/Element (\d+):([\s\S]*?)(?=Element \d+:|$)/g)];

      for (const match of elementMatches) {
        const elementIndex = parseInt(match[1], 10) - 1;
        const feedback = match[2].trim();
        resultMap[elementIndex] = feedback;
      }

      return resultMap;
    } catch (error) {
      console.error('AI validation error:', error);
      return {};
    }
  }

  private async login(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    console.log('Navigating to login page...');
    await this.page.goto(this.config.loginUrl);
    await this.page.waitForLoadState('networkidle');

    console.log('Logging in...');
    await this.page.fill("input[data-test='username']", this.config.username);
    await this.page.fill("input[data-test='password']", this.config.password);
    await this.page.click("input[data-test='login-button']");

    await this.page.waitForLoadState('networkidle');
    console.log('Login successful');
  }

  public async crawl(): Promise<ElementInfo[]> {
    console.log('Starting web crawler...');
    try {
      this.browser = await chromium.launch({
        headless: true,
        timeout: 30000,
      });

      this.page = await this.browser.newPage({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      });

      await this.login();

      console.log(`Navigating to target URL: ${this.config.targetUrl}`);
      await this.page.goto(this.config.targetUrl);
      await this.page.waitForLoadState('networkidle');

      // Improved selector to find all interactive elements
      const elements = await this.page.$$(`
        button, input, select, textarea, a[href], 
        [role="button"], [role="link"], [role="checkbox"], [role="radio"], 
        [role="menuitem"], [role="tab"], [role="combobox"], 
        [role="switch"], [role="listbox"], [role="slider"],
        [tabindex]:not([tabindex="-1"])
      `);

      console.log(`Found ${elements.length} elements to analyze`);
      const elementInfos: ElementInfo[] = [];

      // Process elements in batches
      for (let i = 0; i < elements.length; i += this.batchSize) {
        const batch = elements.slice(i, i + this.batchSize);
        const batchResults = await Promise.all(batch.map(async (element) => {
          try {
            // Extract properties once and reuse
            const properties = await this.extractElementProperties(element);
            const { css, playwright } = this.generateSelectors(properties);

            return {
              tag: properties.tag,
              type: properties.type || '',
              name: properties.name || '',
              id: properties.id || '',
              class: properties.classes || '',
              dataTestId: properties.dataTestId || '',
              cssSelector: css,
              playwrightSelector: playwright,
              description: properties.ariaLabel || properties.placeholder || '',
              aiValidation: ''
            };
          } catch (error) {
            console.error('Error processing element:', error);
            return null;
          }
        }));

        // Filter out failed elements and add to results
        const validResults = batchResults.filter(result => result !== null) as ElementInfo[];
        elementInfos.push(...validResults);

        console.log(`Processed ${Math.min(i + this.batchSize, elements.length)}/${elements.length} elements`);
      }

      // Batch validate with AI
      console.log('Validating elements with AI...');
      const batchSize = 10; // AI batch size
      for (let i = 0; i < elementInfos.length; i += batchSize) {
        const batch = elementInfos.slice(i, i + batchSize);
        const aiResults = await this.validateElementsWithAI(batch);

        // Update each element with its AI validation
        Object.entries(aiResults).forEach(([index, validation]) => {
          const actualIndex = parseInt(index, 10);
          if (actualIndex >= 0 && actualIndex < batch.length) {
            batch[actualIndex].aiValidation = validation;
          }
        });

        console.log(`AI validation progress: ${Math.min(i + batchSize, elementInfos.length)}/${elementInfos.length}`);
      }

      console.log(`Completed processing ${elementInfos.length} elements`);
      return elementInfos;
    } finally {
      await this.browser?.close();
      console.log('Browser closed');
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

    console.log(`Saving ${elements.length} elements to ${filename}`);
    await csvWriter.writeRecords(elements);
    console.log('CSV file created successfully');
  }
}

async function main() {
  try {
    console.log('Loading environment variables...');
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
      openaiApiKey: process.env.OPENAI_API_KEY!,
      openaiBaseURL: process.env.OPENAI_BASE_URL
      
    };

    console.log('Starting crawler...');
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