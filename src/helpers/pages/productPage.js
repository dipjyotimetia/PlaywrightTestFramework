import BasePage from './BasePage';
import RequestHelper from '../requestHelper';
import * as _ from 'lodash';

class ProductPage extends BasePage {

    constructor(page){
        super(page);
        this.selectors = {
            "addToBag": "#addToBasketButton",
            "sizeArray": "#ul-attribute164"
        };
    }

    get pageUrl() {
        return this.url + this.config.product.path;
    }

    async gotoPage() {
        await this.page.goto(this.pageUrl);
        await this.page.waitForSelector(this.selectors.addToBag);
    }

    async addToBag() {
        await this.page.waitForSelector(this.selectors.addToBag);
        await this.page.click(this.selectors.addToBag);
    }

    addToBagAjaxResponsePromise() {
        return RequestHelper.promiseResponseByUrl(this.page, "/ajax/cart/add/");
    }
}

export default ProductPage;