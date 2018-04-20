const { tryReq } = require('../src/proxy');

async function main() {
    const start = new Date();
    const promises = [];
    for (let i = 0; i <= 100; i++) {
        promises.push(tryReq({method: 'GET', uri: 'https://booking.uz.gov.ua/train_search/station/?term=%D0%9A%D0%B8%D1%97%D0%B2' }))
    }
    await Promise.all(promises);
    const end = new Date();
    console.log(`time for ${100} requests: ${(end - start) / 1000}`);
}

main();