const dotenv = require('dotenv')
const excelFile = require('./excelFile')
const scraping = require('./scraping')

const Server = async () => {
    dotenv.config();
    const workbook = await excelFile.SetupExcel();
    const items = await excelFile.ReadExcel(workbook);
    const {browser, header} = await scraping.SetupScraper();

    let scrapingResult = [];
    console.log('start scraping');
    for (const item of items) {
        const index = items.indexOf(item);
        const {cell, message} = await scraping.NewScraper(item, browser, header);
        scrapingResult.push({cell, message});

        if (index === items.length - 1) {
            browser.pages().then((pages) => {
                pages.forEach((page) => {
                    page.close();
                });
            })
        }
    }

    console.log(scrapingResult);
    await excelFile.WriteExcel({workbook, scrapingResult});

    console.log('done scraping');
}

Server().then(() => {
    console.log('server is running');
});

