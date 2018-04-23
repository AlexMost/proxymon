const { tryReq } = require("../src/proxy");
// [{"from":2200001,"fromTitle":"Киев-Пассажирский","to":2204001,"toTitle":"Харьков-Пасс","date":"2018-05-05","chatId":-279719792,"time":"00:00","stop":false,"options":{"trains":["724К"]},"id":"5612"}]
async function bench() {
  const start = new Date();
  let success = 0;
  const total = 100;
  let d1;
  d1 = new Date();
  let time = 0;
  for (let i = 0; i <= total; i++) {
    try {
      await tryReq({
        method: "POST",
        formData: {
            from: 2200001,
            to: 2204001,
            date: "2018-05-05",
            time: "00:00"
        },
        uri:
          "https://booking.uz.gov.ua/ru/train_search"
      }, 10);
      const d2 = new Date();
      const opTime = (d2 - d1) / 1000;
      time += opTime;
      console.log(`${i} ok ... ${opTime}s`);
      d1 = new Date();
      success += 1;
    } catch (err) {
      console.error("rejected by timeout");
    }
  }
  const end = new Date();
  console.log(
    `time for ${total} requests: ${(end - start) /
      1000}. ok - ${success}. nok - ${total - success}. avg - ${time / success}`
  );
}

process.on("uncaughtException", function(err) {});

bench();
bench();
bench();
