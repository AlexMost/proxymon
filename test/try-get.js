const { get } = require('../src/proxy');

async function main() {
    const result = await get({uri: "https://booking.uz.gov.ua/ru/train_search/station/?term=%D0%9A%D0%B8%D0%B5%D0%B2"});
    console.log(result);
}

main();