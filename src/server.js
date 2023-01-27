const dotenv = require('dotenv')
const excelFile = require('./excelFile')
const scraping = require('./scraping')

const Server = async () => {
    dotenv.config();
    const workbook = await excelFile.SetupExcel();
    const items = await excelFile.ReadExcel(workbook);
    const {browser, header} = await scraping.SetupScraper();
    const batchSize = 5;

    console.log('starting scraping');
    let scrapingResult = [];

    const parallelScraping = async (items, browser, header) => {
        const scrapingPromises = items.map(async item => {
            return await scraping.NewScraper(item, browser, header);
        });
        return await Promise.all(scrapingPromises);
    }

    for (let i = 0; i < items.length; i += batchSize) {
        const subArray = items.slice(i, i + batchSize);
        scrapingResult = scrapingResult.concat(await parallelScraping(subArray, browser, header));
    }

    browser.pages().then((pages) => {
        pages.forEach((page) => {
            page.close();
        });
    });

    await excelFile.WriteExcel({workbook, scrapingResult});
    console.log('done scraping');
}


Server().then(() => {
    return process.exit(0);
});

