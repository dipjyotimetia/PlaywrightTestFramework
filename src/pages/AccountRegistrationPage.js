import * as _ from 'lodash';
import faker from 'faker';
import BasePage from './BasePage';
import { registrationPage } from '../helpers/Locators';

const logger = require('../config/logger')(__filename);

class AccountRegistrationPage extends BasePage {
  constructor(page) {
    super(page);
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
      await this.page.waitForSelector(registrationPage.joinNowBtn);
      await this.page.click(registrationPage.joinNowBtn);
      logger.info('Join now completed');
    } catch (error) {
      logger.info(error);
    }
  }

  async enterDetails(userData) {
    let data = userData;
    data = _.merge(this.defaultUserData, data);
    await this.page.waitForSelector(registrationPage.email);
    await this.page.click(registrationPage.email);
    await this.page.type(registrationPage.email, data.email);
    await this.page.click(registrationPage.fname);
    await this.page.type(registrationPage.fname, data.fname);
    await this.page.click(registrationPage.lname);
    await this.page.type(registrationPage.lname, data.lname);
    await this.page.click(registrationPage.dob);
    await this.page.type(registrationPage.dob, data.dob);
    await this.page.click(registrationPage.address);
    await this.page.type(registrationPage.address, data.address);
    await this.page.waitForSelector(registrationPage.addressAutoComplete);
    const autoComplete = await this.page.$(
      registrationPage.addressAutoComplete
    );
    await autoComplete.click();
    await this.page.click(registrationPage.mobile);
    await this.page.type(registrationPage.mobile, data.mobile);
    logger.info('User details entered');
    return data;
  }
}

export default AccountRegistrationPage;
