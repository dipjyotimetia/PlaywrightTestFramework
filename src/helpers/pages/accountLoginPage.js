import BasePage from './BasePage';
import * as _ from 'lodash';
import faker from 'faker';

class AccountLoginPage extends BasePage {

    constructor(page) {
        super(page);
        this.selectors = {
            "login": "div.login-flyout-button--login",
            "joinNowBtn": "div.login-flyout-button--join-now",
            "loginForm": ".login-form",
            "userName": "input[name='username']",
            "password": "input[name='password']",
            "loginBtn": ".login-form button[type='submit']",
            "loggedinIdentifier": ".account-btn-text"
        };
        this.defaultUserData = {
            userName: "betcentuser7",
            password: "Password1"
        };
    }

    get pageUrl() {
        return this.url;
    }

    async gotoPage() {
        await this.page.goto(this.pageUrl);
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

    async enterPasswords(passwordData) {
        passwordData = _.merge(this.defaultPasswordData, passwordData);
        await this.page.click(this.selectors.password);
        await this.page.type(this.selectors.password, passwordData.password);
        await this.page.click(this.selectors.confirmation);
        await this.page.type(this.selectors.confirmation, passwordData.confirmation);
        return passwordData;
    }

    async submitForm() {
        await this.page.focus(this.selectors.registerButton);
        await this.page.click(this.selectors.registerButton);
    }

}

export default AccountLoginPage;