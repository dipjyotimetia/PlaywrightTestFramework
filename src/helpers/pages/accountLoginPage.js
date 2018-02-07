import BasePage from './BasePage';
import * as _ from 'lodash';
import faker from 'faker';

class AccountLoginPage extends BasePage {

    constructor(page){
        super(page);
        this.selectors = {
            "registerTab": "#register-tab",
            "firstname": "#firstname",
            "lastname": "#lastname",
            "email": "#email",
            "dob": "#birth_date",
            "password": "#password",
            "confirmation": "#confirmation",
            "registerButton": "#register"
        };
        this.defaultUserData = {
            firstName: "test",
            lastName: "user",
            email: faker.internet.email(),
            dob: "01011990",
        };
        this.defaultPasswordData = {
            password: "Tester01",
            confirmation: "Tester01"
        };
    }

    get pageUrl() {
        return this.url + "/customer/account/login/";
    }

    async gotoPage() {
        await this.page.goto(this.pageUrl);
        await this.page.waitForSelector(this.selectors.registerTab);
    }

    async selectRegister() {
        await this.page.focus(this.selectors.registerTab);
        this.page.click(this.selectors.registerTab);
    }

    async enterUserDetails(userData) {
        userData = _.merge(this.defaultUserData, userData);
        await this.page.focus(this.selectors.firstname);
        await this.page.click(this.selectors.firstname);
        await this.page.type(this.selectors.firstname, userData.firstName);
        await this.page.click(this.selectors.lastname);
        await this.page.type(this.selectors.lastname, userData.lastName);
        await this.page.click(this.selectors.email);
        await this.page.type(this.selectors.email, userData.email);
        await this.page.click(this.selectors.dob);
        await this.page.type(this.selectors.dob, userData.dob);
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