import BasePage from './BasePage';
import * as _ from 'lodash';

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
    return this.url;
  }

  async gotoPage() {
    await this.page.goto(this.pageUrl, {
      waitUntil: 'networkidle2'
    });
  }

  async selectLogin() {
    await this.page.waitForSelector(this.selectors.login);
    await this.page.click(this.selectors.login);
  }

  async enterUserDetails(userData) {
    userData = _.merge(this.defaultUserData, userData);
    await this.page.focus(this.selectors.loginForm);
    await this.page.click(this.selectors.userName);
    await this.page.type(this.selectors.userName, userData.userName);
    await this.page.click(this.selectors.password);
    await this.page.type(this.selectors.password, userData.password);
    await this.page.click(this.selectors.loginBtn);
    return userData;
  }

}

export default AccountLoginPage;