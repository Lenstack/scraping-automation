const randomUseragent = require("random-useragent");
const puppeteer = require("puppeteer");
const useProxy = require('puppeteer-page-proxy');
const {PROXY} = require('./proxy');
const NewScraper = async function (item, browser, header) {

    const page = await browser.newPage();
    await useProxy(page, PROXY);
    await page.setUserAgent(header);
    await page.setViewport({width: 1920, height: 1080});

    try {
        await page.goto(process.env.URL, {waitUntil: 'networkidle2'});
        /*
        // wait for input field document-dni
        await page.waitForSelector(`#mat-input-0`);
        await page.type(`#mat-input-0`, process.env.SCRAPING_USERNAME);
        // wait for button available
        await page.waitForSelector(`.mat-focus-indicator .mat-raised-button`);
        await page.click(`.mat-focus-indicator .mat-raised-button`);

        await page.screenshot({path: `screenshots/${new Date().valueOf()}.png`});

         */
        await page.screenshot({path: `screenshots/${new Date().valueOf()}.png`});
        await page.close();
        return {cell: item, message: 'success'};
    } catch (err) {
        console.log(err);
    }

    return {cell: item, message: 'error'};
}

const SetupScraper = async function () {
    const header = randomUseragent.getRandom((ua) => parseFloat(ua.browserVersion) >= 50);
    const minimal_args = [
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
    ];
    const browser = await puppeteer.launch({headless: true, args: minimal_args});
    return {browser, header};
}

module.exports = {
    SetupScraper,
    NewScraper
}