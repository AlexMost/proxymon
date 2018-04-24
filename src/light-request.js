const https = require("https");
const querystring = require("querystring");
var HttpsProxyAgent = require('https-proxy-agent');

async function lightPOST(proxy, formData) {
  const postData = querystring.stringify(formData);

  var agent = new HttpsProxyAgent(proxy);

  const options = {
    hostname: "booking.uz.gov.ua",
    port: 443,
    method: "POST",
    path: "/ru/train_search/",
    agent: agent,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    let req = null;
    const timeout = setTimeout(() => {
        req.abort();
        req.destroy();
        reject('timeout');
    }, 5000);
    req = https.request(options, res => {
        let data = '';
        res.setEncoding("utf8");
        res.on("data", chunk => {
            data += chunk;
        });
        res.on("end", () => {
            clearTimeout(timeout);
            resolve(data);
        });
      });
    
      req.on("error", e => {
        clearTimeout(timeout);
        reject(e);
      });
      // write data to request body
      req.write(postData);
      req.end();
  });
}

module.exports = { lightPOST };
