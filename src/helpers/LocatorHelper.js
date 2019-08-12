/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
import expect from 'expect-puppeteer';

class LocatorHelper {
  constructor(page) {
    this.page = page;
  }

  async getElementAttribute(locator, attribute) {
    const result = await this.page.evaluate(
      (loc, attr) => {
        const res = document.querySelector(loc).getAttribute(attr);
        return res;
      },
      locator,
      attribute
    );
    return result;
  }

  async getThisChild(parent, index) {
    const children = await this.page.evaluateHandle(
      ele => ele.childNodes,
      parent
    );
    const child = await this.page.evaluateHandle(
      (ele, idx) => ele[idx],
      children,
      index
    );
    return child;
  }

  async elementShouldNotExist(locator) {
    let elemNotPresent = true;
    const ele = await this.page.$(locator);
    if (ele !== null) {
      elemNotPresent = false;
    }
    return elemNotPresent;
  }

  async returnParent(locator) {
    // locator is the element and not the HTML attribute
    const parent = await this.page.evaluateHandle(
      ele => ele.parentNode,
      locator
    );
    return parent;
  }

  async returnNextSibling(locator) {
    // locator is the element and not the HTML attribute
    const sibling = await this.page.evaluateHandle(
      ele => ele.nextElementSibling,
      locator
    );
    return sibling;
  }

  async returnTextContent(element) {
    const text = await this.page.evaluate(ele => ele.textContent, element);
    return text;
  }

  async clickAndWaitForLoad(arg1, arg2) {
    const elementToClick = await this.page.$(arg1);
    await elementToClick.click();
    await this.page.waitForSelector(arg2);
  }

  async blockImage() {
    await this.page.setRequestInterception(true);
    this.page.on('request', request => {
      if (request.resourceType() === 'image') {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  async expectMatch(value) {
    await expect(this.page).toMatch(value);
  }

  async toClick(buttonName) {
    await expect(this.page).toClick('button', { text: buttonName });
  }

  async promiseClick(locator) {
    await Promise.all([
      this.page.waitForNavigation({}),
      this.page.click(locator, {
        button: 'left',
        delay: 200,
      }),
    ]);
  }

  async frameWrite(frameName) {
    const frame = await this.page.frames().find(f => f.name() === frameName);
    await (await frame.$('#registration')).type('test', { delay: 100 });
  }

  async hover(locator) {
    await this.page.hover(locator);
  }

  async switchToPage() {
    let newPage = null;

    await browser.on('targetcreated', async target => {
      if (target.type() !== 'page') {
        return;
      }
      newPage = await target.page();

      return newPage;
    });
  }

  async acceptPrompt() {
    this.page.on('dialog', msg => {
      msg.accept();
    });
  }

  async dismissPrompt() {
    this.page.on('dialog', msg => {
      msg.dismiss();
    });
  }

  async typePrompt(message) {
    this.page.on('dialog', msg => {
      msg.type(message);
    });
  }

  async getMessage() {
    this.page.on('dialog', msg => msg.message());
  }

  async clickPopup() {
    this.page.on('popup', args => {
      args.click();
    });
  }

  async click(locator, button) {
    this.page.click(locator, {
      button, // left,right,middle
      clickCount: 1,
      delay: 200, // how long to hold
    });
  }

  async mouseClick(locator, button) {
    const mouse = page.mouse();
    mouse.click(locator, {
      button,
      clickCount: 1,
      delay: 200,
    });
  }
}

export default LocatorHelper;
