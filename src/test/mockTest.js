const loginResponse = require('../../mockresponse/loginResponse.json');
const validUser = require('../../mockresponse/validUser.json');

jest.setTimeout(60000);
const config = require('../../config/index');
const HomePage = require('../../pages/HomePage');
const Mocker = require('../../helpers/Mocker');
const mckUser = require('../../testData/index').mockUser1;
const readYaml = require('read-yaml');
const fs = require('fs');

const snapshotsPath = global.__SNAPSHOTDIR__;

const allObjects = readYaml.sync('pages/pageObjects.yaml');


describe('Home page', () => {
    let page;
    let homePage;
    let mck;

    it('login to mocked user', async() => {
        mck.mock(false, '/api/account/login', loginResponse, 200, 'POST');
        mck.mock(false, '/api/account/detail', validUser);
        await homePage.header.openLoginFlyoutAndLogin(mckUser.user, mckUser.pswd);
        await page.waitFor(3000);
    });
    beforeAll(async() => {
        page = await global.__CONTEXT__.newPage();
        await page.setViewport({ width: 1000, height: 500 });
        homePage = new HomePage(page);
        await page.goto(config.BASE_URL, { timeout: 60000 });
        await homePage.pageLoaded();
        mck = new Mocker(page, config.BASE_URL, config.cors__API_BASE_URL);
        mck.mocker();
    });
    afterAll(async() => {
        await page.screenshot({ path: `${snapshotsPath}loginMocked.png`, fullPage: true });
        await page.close();
    });
});
