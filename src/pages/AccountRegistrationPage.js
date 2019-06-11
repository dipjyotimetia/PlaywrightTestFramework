import * as _ from 'lodash';
import faker from 'faker';
import BasePage from './BasePage';

const logger = require('../config/logger')(__filename);

class AccountRegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      joinNowBtn: "a[href='/join-now']",
      fname: "input[name='firstName']",
      lname: "input[name='surname']",
      dob: "input[name='DOB']",
      address: "input[name='address']",
      addressAutoComplete: "button[class*='AutoComplete']",
      mobile: "input[name='mobileNumber']",
      email: "input[name='email']",
      password: "input[name='password']",
    };
    this.defaultUserData = {
      fname: faker.name.firstName(),
      lname: faker.name.lastName(),
      dob: '11/11/1980',
      address: 'L 26 120 collins street , Melbourne VIC 3000',
      mobile: faker.phone.phoneNumber(),
      email: faker.internet.email(),
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

  async joinNow() {
    try {
      await this.page.waitForSelector(this.selectors.joinNowBtn);
      await this.page.click(this.selectors.joinNowBtn);
      logger.info('Join now completed');
    } catch (error) {
      logger.info(error);
    }
  }

  async enterDetails(userData) {
    let data = userData;
    data = _.merge(this.defaultUserData, data);
    await this.page.waitForSelector(this.selectors.email);
    await this.page.click(this.selectors.email);
    await this.page.type(this.selectors.email, data.email);
    await this.page.click(this.selectors.fname);
    await this.page.type(this.selectors.fname, data.fname);
    await this.page.click(this.selectors.lname);
    await this.page.type(this.selectors.lname, data.lname);
    await this.page.click(this.selectors.dob);
    await this.page.type(this.selectors.dob, data.dob);
    await this.page.click(this.selectors.address);
    await this.page.type(this.selectors.address, data.address);
    await this.page.waitForSelector(this.selectors.addressAutoComplete);
    const autoComplete = await this.page.$(this.selectors.addressAutoComplete);
    await autoComplete.click();
    await this.page.click(this.selectors.mobile);
    await this.page.type(this.selectors.mobile, data.mobile);
    logger.info('User details entered');
    return data;
  }
}

export default AccountRegistrationPage;
