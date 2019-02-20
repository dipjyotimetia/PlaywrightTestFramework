import BasePage from './BasePage';
import * as _ from 'lodash';
const logger = require('../config/logger')(__filename);

class AccountLoginPage extends BasePage {

  constructor(page) {
    super(page);
    this.selectors = {
      'login': 'button[class*=\'TopBarDropDown__login--\']',
      'joinNowBtn': 'a[href=\'/join-now\']',
      'loginForm': 'div[class*=\'oginDropDownContent--\']',
      'userName': 'input[class*=\'Field__fieldInput--\']',
      'password': 'input[class*=\'Field__fieldInput--\'][type=\'password\']',
      'loginBtn': 'button[class*=\'LoginDropDown__login--\']',
      'loggedinIdentifier': '.account-btn-text'
    };
    this.defaultUserData = {
      userName: 'micktest6@be.com',
      password: 'Password1'
    };
  }

  get pageUrl() {
    logger.info('Redirected to url');
    return this.url;
  }

  async gotoPage() {
    await this.page.goto(this.pageUrl, {
      waitUntil: 'networkidle2'
    });
  }

  async selectLogin() {
    try {
      await this.page.waitForSelector(this.selectors.login);
      await this.page.click(this.selectors.login);
      logger.info('logged in');
    } catch (error) {
      logger.info(error);
    }
  }

  async enterUserDetails(userData) {
    userData = _.merge(this.defaultUserData, userData);
    await this.page.focus(this.selectors.loginForm);
    await this.page.click(this.selectors.userName);
    await this.page.type(this.selectors.userName, userData.userName);
    await this.page.click(this.selectors.password);
    await this.page.type(this.selectors.password, userData.password);
    await this.page.click(this.selectors.loginBtn);
    await this.page.evaluate(() => document.querySelector('a[class*=\'NavBarLink__racing\'] > span').click());
    logger.info('user details enterted');
    return userData;
  }

}

export default AccountLoginPage;