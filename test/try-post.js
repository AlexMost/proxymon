const { postForm, tryFromPOST } = require("../src/proxy");
const formData = {
    from: 2200001,
    to: 2204001,
    date: "2018-06-05",
    time: "00:00"
  };

async function bench() {
    const d1 = new Date();
    const data = await tryFromPOST({
        formData,
        uri: "https://booking.uz.gov.ua/ru/train_search/"
    });
    const d2 = new Date();
    const opTime = (d2 - d1) / 1000;
    console.log(`time - ${opTime}s`);
    console.log(data);
}

bench();