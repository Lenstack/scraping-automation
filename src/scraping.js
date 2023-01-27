const randomUseragent = require("random-useragent");
const puppeteer = require("puppeteer");
const useProxy = require('puppeteer-page-proxy');
const {PROXY} = require('./proxy');
const NewScraper = async function (item, browser, header) {
/*
    const page = await browser.newPage();
    await useProxy(page, PROXY);
    await page.setUserAgent(header);
    await page.setViewport({width: 1920, height: 1080});

    try {
        await page.goto(process.env.URL);
        // wait for input field document-dni
        await page.waitForSelector(`#mat-input-0`);
        await page.type(`#mat-input-0`, process.env.SCRAPING_USERNAME);
        // wait for button available
        await page.waitForSelector(`.mat-focus-indicator .mat-raised-button`);
        await page.click(`.mat-focus-indicator .mat-raised-button`);

        await page.screenshot({path: `screenshots/${new Date().valueOf()}.png`});
        await page.close();
        return {cell: item, message: 'success'};
    } catch (err) {
        console.log(err);
    }
*/
    return {cell: item, message: 'error'};
}

const SetupScraper = async function () {
    const header = randomUseragent.getRandom((ua) => parseFloat(ua.browserVersion) >= 50);
    const browser = await puppeteer.launch({headless: true});
    return {browser, header};
}

module.exports = {
    SetupScraper,
    NewScraper
}