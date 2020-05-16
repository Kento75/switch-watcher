var synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const pageLoadBlueprint = async function () {

    // INSERT URL here
    const URL = "https://www.amazon.co.jp/dp/B07WXL5YPW/?coliid=I3GUVQ2SRVB6GQ&colid=1N3CJEG1V980E&psc=0&ref_=lv_ov_lig_dp_it";
    const XPATH = '//*[@id="olp-sl-new-used"]/span[1]/span';
    const LIST_PRICE = 33000;
    // debug用↓
    //const LIST_PRICE = 43000;

    let page = await synthetics.getPage();
    const response = await page.goto(URL, {waitUntil: 'domcontentloaded', timeout: 30000});
    //Wait for page to render.
    //Increase or decrease wait time based on endpoint being monitored.
    await page.waitFor(15000);
    await synthetics.takeScreenshot('loaded', 'loaded');
    let pageTitle = await page.title();
    log.info('Page title: ' + pageTitle);
    if (response.status() !== 200) {
        throw "Failed to load page!";
    }
    const elementHandleList = await page.$x(XPATH);
    let itemTextValue = await(await elementHandleList[0].getProperty('innerText')).jsonValue();

    if(Number(itemTextValue.toString().slice(1).replace(',', '')) < LIST_PRICE) {
      log.info("itemTextValue :" + itemTextValue);
      log.info("LIST_PRICE : " + LIST_PRICE);
      log.info("Debug", "Buy Fast!");
      throw "Buy Fast! " + URL;
    }
};

exports.handler = async () => {
    return await pageLoadBlueprint();
};
