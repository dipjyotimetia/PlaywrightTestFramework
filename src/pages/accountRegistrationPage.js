import BasePage from './basePage';
import * as _ from 'lodash';
import faker from 'faker';

class AccountRegistrationPage extends BasePage {

    constructor(page) {
        super(page);
        this.selectors = {
            "joinNowBtn": "div.login-flyout-button--join-now",
            "fname": "input[name='FirstName']",
            "lname": "input[name='Surname']",
            "dob": "input[name='DOB']",
            "address": "input[name='AutoResidentialAddress1']",
            "mobile": "input[name='MobileNo']",
            "email": "input[name='Email']",
            "password": "input[name='Password']",
        }
        this.defaultUserData = {
            fname: faker.name.firstName(),
            lname: faker.name.lastName(),
            dob: '11/11/1980',
            address: 'G 120 Collins St Melbourne VIC 3000',
            mobile: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            password: 'Password1'
        }
    }

    get pageUrl() {
        return this.url;
    }

    async gotoPage() {
        await this.page.goto(this.pageUrl);
    }

    async joinNow() {
        await this.page.waitForSelector(this.selectors.joinNowBtn);
        await this.page.click(this.selectors.joinNowBtn);
        await this.page.waitForNavigation();
    }

    async enterDetails(userData) {
        userData = _.merge(this.defaultUserData, userData);
        await this.page.waitForSelector(this.selectors.fname);
        await this.page.click(this.selectors.fname);
        await this.page.type(this.selectors.fname, userData.fname);
        await this.page.click(this.selectors.lname);
        await this.page.type(this.selectors.lname, userData.lname);
        await this.page.click(this.selectors.dob);
        await this.page.type(this.selectors.dob, userData.dob);
        await this.page.click(this.selectors.address);
        await this.page.type(this.selectors.address, userData.address);
        await this.page.click(this.selectors.mobile);
        await this.page.type(this.selectors.mobile, userData.mobile);
        await this.page.click(this.selectors.email);
        await this.page.type(this.selectors.email, userData.email);
        return userData;
    }
}

export default AccountRegistrationPage;