import * as _ from 'lodash';
import BasePage from './BasePage';
import { loginPage } from '../helpers/Locators';

const logger = require('../config/logger')(__filename);

class AccountLoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.defaultUserData = {
      userName: 'micktest6@be.com',
      password: 'Password1',
    };
  }

  get pageUrl() {
    logger.info('Redirected to url');
    return this.url;
  }

  async gotoPage() {
    await this.page.goto(this.pageUrl, {
      waitUntil: 'networkidle2',
    });
  }

  async selectLogin() {
    try {
      await this.page.waitForSelector(loginPage.login);
      await this.page.click(loginPage.login);
      logger.info('logged in');
    } catch (error) {
      logger.info(error);
    }
  }

  async enterUserDetails(userData) {
    let data = userData;
    data = _.merge(this.defaultUserData, data);
    await this.page.click(loginPage.userName);
    await this.page.type(loginPage.userName, data.userName);
    await this.page.click(loginPage.password);
    await this.page.type(loginPage.password, data.password);
    await this.page.click(loginPage.loginBtn);
    await this.page.evaluate(() =>
      document.querySelector("a[class*='NavBarLink__racing'] > span").click()
    );
    logger.info('user details entered');
    return data;
  }
}

export default AccountLoginPage;
