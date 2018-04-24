const { lightPOST } = require("../src/light-request");

async function main() {
  const result = await lightPOST("http://189.52.134.67:20183", {
    from: 2200001,
    to: 2204001,
    date: "2018-05-05",
    time: "00:00"
  });
  console.log(result);
}

main();
// const http = require("http");
// const https = require("https");
// const querystring = require("querystring");
// var HttpsProxyAgent = require('https-proxy-agent');

// var agent = new HttpsProxyAgent("http://189.52.134.67:20183");

// const postData = querystring.stringify({
//   from: 2200001,
//   to: 2204001,
//   date: "2018-05-05",
//   time: "00:00"
// });

// const options = {
//   hostname: "booking.uz.gov.ua",
//   port: 443,
//   method: "POST",
//   path: "/ru/train_search/",
//   agent: agent,
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//     "Content-Length": Buffer.byteLength(postData)
//   }
// };

// const req = https.request(options, res => {
//   console.log(`STATUS: ${res.statusCode}`);
//   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//   res.setEncoding("utf8");
//   res.on("data", chunk => {
//     console.log(`BODY: ${chunk}`);
//   });
//   res.on("end", () => {
//     console.log("No more data in response.");
//   });
// });

// req.on("error", e => {
//   console.error(`problem with request: ${e.message}`);
// });

// // write data to request body
// req.write(postData);
// req.end();
