const https = require("https");
const url = require("url");
const querystring = require("querystring");
var HttpsProxyAgent = require("https-proxy-agent");

function formPOST(options, cb) {
  const postData = querystring.stringify(options.formData);
  var agent = new HttpsProxyAgent(options.proxy);
  const urlData = url.parse(options.uri);

  const reqOpts = {
    hostname: urlData.hostname,
    method: "POST",
    path: urlData.path,
    agent: agent,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  let req = null;
  const timeout = setTimeout(() => {
    req.abort();
    req.destroy();
    cb("timeout");
  }, options.timeout);

  req = https.request(reqOpts, res => {
    if (res.statusCode === 200) {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        cb(null, data); // return data immediately
        clearTimeout(timeout);
        req.destroy();
      });
    } else {
      res.destroy();
      req.destroy();
      cb(`Bad status ${res.statusCode}`);
    }
  });

  req.on("error", e => {
    clearTimeout(timeout);
    cb(e);
  });
  req.on("uncaughtException", e => {
    clearTimeout(timeout);
    cb(e);
  });

  // write data to request body
  req.write(postData);
  req.end();

  return req;
}

module.exports = { formPOST };
