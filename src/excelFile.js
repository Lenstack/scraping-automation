const exceljs = require('exceljs');

const ReadExcel = async (workbook) => {
    const items = [];
    try {
        await workbook.xlsx.readFile(process.env.EXCEL_FILE).then(() => {
            const worksheet = workbook.getWorksheet(process.env.EXCEL_SHEET);
            worksheet.eachRow(function (row) {
                const cells = row.getCell(parseInt(process.env.EXCEL_READ_COLUMN)).value
                const message = row.getCell(parseInt(process.env.EXCEL_WRITE_COLUMN)).value
                !message ? items.push(cells) : null;
            });
            return workbook.xlsx.writeFile(process.env.EXCEL_FILE);
        })
    } catch (err) {
        console.log(err);
    }
    return items;
}

const WriteExcel = async ({workbook, scrapingResult}) => {
    const batchSize = parseInt(process.env.EXCEL_WRITE_BATCH_SIZE);
    let currentIndex = 0;
    const worksheet = workbook.getWorksheet(process.env.EXCEL_SHEET);
    const excelHash = {}
    worksheet.eachRow(function (row) {
        const cells = row.getCell(parseInt(process.env.EXCEL_READ_COLUMN)).value;
        excelHash[cells] = row.getCell(parseInt(process.env.EXCEL_WRITE_COLUMN))
    });

    try {
        while (currentIndex < scrapingResult.length) {
            let endIndex = currentIndex + batchSize;
            if (endIndex > scrapingResult.length) {
                endIndex = scrapingResult.length;
            }

            let batch = scrapingResult.slice(currentIndex, endIndex);
            batch.forEach((itemsScraping) => {
                excelHash[itemsScraping.cell].value = itemsScraping.message;
            });
            currentIndex += batchSize;
        }
        await workbook.xlsx.writeFile(process.env.EXCEL_FILE);
        console.log('file saved');
    } catch (err) {
        console.log(err);
    }
}



const SetupExcel = async () => {
    return new exceljs.Workbook();
}

module.exports = {
    SetupExcel,
    ReadExcel,
    WriteExcel
}