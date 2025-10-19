import { Locator, expect, Page } from '@playwright/test';

/**
 * A11yActions - Accessibility testing utilities for Playwright
 * Provides methods for testing accessibility features and ARIA attributes
 * Uses Playwright v1.46+ accessibility assertions
 */
export class A11yActions {
  /**
   * Verifies that an element has the specified accessible description.
   * Uses Playwright v1.46+ expect().toHaveAccessibleDescription() assertion.
   * @param locator - The Playwright locator for the element
   * @param description - The expected accessible description
   * @throws AssertionError if the description doesn't match
   */
  async verifyAccessibleDescription(
    locator: Locator,
    description: string | RegExp
  ): Promise<void> {
    await expect(locator).toHaveAccessibleDescription(description);
  }

  /**
   * Verifies that an element has the specified ARIA role.
   * Uses Playwright v1.46+ expect().toHaveRole() assertion.
   * @param locator - The Playwright locator for the element
   * @param role - The expected ARIA role (e.g., 'button', 'navigation', 'link')
   * @throws AssertionError if the role doesn't match
   */
  async verifyRole(
    locator: Locator,
    role:
      | 'alert'
      | 'alertdialog'
      | 'application'
      | 'article'
      | 'banner'
      | 'blockquote'
      | 'button'
      | 'caption'
      | 'cell'
      | 'checkbox'
      | 'code'
      | 'columnheader'
      | 'combobox'
      | 'complementary'
      | 'contentinfo'
      | 'definition'
      | 'deletion'
      | 'dialog'
      | 'directory'
      | 'document'
      | 'emphasis'
      | 'feed'
      | 'figure'
      | 'form'
      | 'generic'
      | 'grid'
      | 'gridcell'
      | 'group'
      | 'heading'
      | 'img'
      | 'insertion'
      | 'link'
      | 'list'
      | 'listbox'
      | 'listitem'
      | 'log'
      | 'main'
      | 'marquee'
      | 'math'
      | 'meter'
      | 'menu'
      | 'menubar'
      | 'menuitem'
      | 'menuitemcheckbox'
      | 'menuitemradio'
      | 'navigation'
      | 'none'
      | 'note'
      | 'option'
      | 'paragraph'
      | 'presentation'
      | 'progressbar'
      | 'radio'
      | 'radiogroup'
      | 'region'
      | 'row'
      | 'rowgroup'
      | 'rowheader'
      | 'scrollbar'
      | 'search'
      | 'searchbox'
      | 'separator'
      | 'slider'
      | 'spinbutton'
      | 'status'
      | 'strong'
      | 'subscript'
      | 'superscript'
      | 'switch'
      | 'tab'
      | 'table'
      | 'tablist'
      | 'tabpanel'
      | 'term'
      | 'textbox'
      | 'time'
      | 'timer'
      | 'toolbar'
      | 'tooltip'
      | 'tree'
      | 'treegrid'
      | 'treeitem'
  ): Promise<void> {
    await expect(locator).toHaveRole(role);
  }

  /**
   * Verifies that an element has the specified accessible name.
   * @param locator - The Playwright locator for the element
   * @param name - The expected accessible name
   * @throws AssertionError if the name doesn't match
   */
  async verifyAccessibleName(
    locator: Locator,
    name: string | RegExp
  ): Promise<void> {
    await expect(locator).toHaveAccessibleName(name);
  }

  /**
   * Verifies that an interactive element (button, link, input) is accessible via keyboard.
   * Checks if the element can be focused and activated with keyboard.
   * @param page - The Playwright page object
   * @param locator - The Playwright locator for the element
   * @returns true if element is keyboard accessible
   */
  async verifyKeyboardAccessibility(
    page: Page,
    locator: Locator
  ): Promise<boolean> {
    try {
      // Focus the element
      await locator.focus();

      // Verify element has focus
      const isFocused = await locator.evaluate(
        (el) => el === document.activeElement
      );

      if (!isFocused) {
        throw new Error('Element is not focusable');
      }

      // Try to activate with Enter key
      await page.keyboard.press('Enter');

      return true;
    } catch (error) {
      console.error(`Keyboard accessibility check failed: ${error}`);
      return false;
    }
  }

  /**
   * Verifies that form inputs have associated labels for screen readers.
   * @param locator - The Playwright locator for the input element
   * @throws AssertionError if input doesn't have a label
   */
  async verifyInputHasLabel(locator: Locator): Promise<void> {
    const labelText = await locator.evaluate((input: HTMLInputElement) => {
      // Check for explicit label (via 'for' attribute)
      const id = input.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) return label.textContent;
      }

      // Check for implicit label (input wrapped in label)
      const parentLabel = input.closest('label');
      if (parentLabel) return parentLabel.textContent;

      // Check for aria-label
      const ariaLabel = input.getAttribute('aria-label');
      if (ariaLabel) return ariaLabel;

      // Check for aria-labelledby
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy);
        if (labelElement) return labelElement.textContent;
      }

      return null;
    });

    if (!labelText) {
      throw new Error('Input element does not have an associated label');
    }
  }

  /**
   * Verifies that images have alt text for screen readers.
   * @param locator - The Playwright locator for the image element
   * @throws AssertionError if image doesn't have alt text
   */
  async verifyImageHasAltText(locator: Locator): Promise<void> {
    const altText = await locator.getAttribute('alt');

    if (altText === null) {
      throw new Error('Image element does not have an alt attribute');
    }

    // Empty alt is allowed for decorative images
    // Non-empty alt is required for meaningful images
  }

  /**
   * Checks if an element is visible to screen readers.
   * Verifies that the element is not hidden via aria-hidden or CSS.
   * @param locator - The Playwright locator for the element
   * @returns true if visible to screen readers
   */
  async isVisibleToScreenReaders(locator: Locator): Promise<boolean> {
    const isHidden = await locator.evaluate((el: HTMLElement) => {
      // Check aria-hidden
      if (el.getAttribute('aria-hidden') === 'true') {
        return true;
      }

      // Check CSS visibility
      const style = window.getComputedStyle(el);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'
      ) {
        return true;
      }

      return false;
    });

    return !isHidden;
  }

  /**
   * Verifies that heading levels are in proper hierarchical order (h1, h2, h3, etc.).
   * @param page - The Playwright page object
   * @throws Error if heading hierarchy is invalid
   */
  async verifyHeadingHierarchy(page: Page): Promise<void> {
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map((h) => ({
        level: parseInt(h.tagName.substring(1)),
        text: h.textContent?.trim() || '',
      }));
    });

    if (headings.length === 0) {
      return; // No headings to check
    }

    // Verify h1 exists
    const hasH1 = headings.some((h) => h.level === 1);
    if (!hasH1) {
      throw new Error('Page is missing an h1 heading');
    }

    // Check for skipped levels
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level;
      const currLevel = headings[i].level;

      if (currLevel > prevLevel + 1) {
        throw new Error(
          `Heading hierarchy skip detected: h${prevLevel} followed by h${currLevel}. Text: "${headings[i].text}"`
        );
      }
    }
  }

  /**
   * Verifies that interactive elements have sufficient color contrast.
   * Note: This is a basic check. For comprehensive color contrast testing,
   * consider using tools like axe-core or lighthouse.
   * @param locator - The Playwright locator for the element
   * @param minimumRatio - The minimum contrast ratio (default: 4.5 for normal text, 3 for large text)
   * @returns Contrast ratio
   */
  async checkColorContrast(
    locator: Locator,
    minimumRatio: number = 4.5
  ): Promise<number> {
    const contrast = await locator.evaluate(
      (el: HTMLElement, minRatio: number) => {
        const getRelativeLuminance = (rgb: number[]): number => {
          const [r, g, b] = rgb.map((val) => {
            const s = val / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const parseColor = (color: string): number[] => {
          const rgb = color.match(/\d+/g);
          return rgb ? rgb.slice(0, 3).map(Number) : [0, 0, 0];
        };

        const style = window.getComputedStyle(el);
        const fgColor = parseColor(style.color);
        const bgColor = parseColor(style.backgroundColor);

        const l1 = getRelativeLuminance(fgColor);
        const l2 = getRelativeLuminance(bgColor);

        const ratio =
          l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);

        if (ratio < minRatio) {
          console.warn(
            `Color contrast ratio ${ratio.toFixed(2)} is below minimum ${minRatio}`
          );
        }

        return ratio;
      },
      minimumRatio
    );

    return contrast;
  }

  /**
   * Verifies that a page region has the appropriate landmark role.
   * Landmarks help screen reader users navigate the page.
   * @param locator - The Playwright locator for the element
   * @param expectedRole - Expected landmark role (banner, navigation, main, complementary, contentinfo, etc.)
   */
  async verifyLandmarkRole(
    locator: Locator,
    expectedRole:
      | 'banner'
      | 'navigation'
      | 'main'
      | 'complementary'
      | 'contentinfo'
      | 'search'
      | 'region'
      | 'form'
  ): Promise<void> {
    await expect(locator).toHaveRole(expectedRole);
  }
}
