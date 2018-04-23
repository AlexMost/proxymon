const { tryReq } = require("../src/proxy");

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
        method: "GET",
        uri:
          "https://booking.uz.gov.ua/train_search/station/?term=%D0%9A%D0%B8%D1%97%D0%B2"
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
