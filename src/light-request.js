const https = require("https");
const http = require("http");
const url = require("url");
const querystring = require("querystring");
var HttpsProxyAgent = require("https-proxy-agent");

function formPOST(options, cb) {
  const postData = querystring.stringify(options.formData);
  const proxyData = url.parse(options.proxy);
  var agent = new HttpsProxyAgent({
    host: proxyData.hostname,
    port: proxyData.port,
    secureProxy: proxyData.protocol === "https:"
  });
  const urlData = url.parse(options.uri);

  const reqOpts = {
    host: urlData.hostname,
    method: "POST",
    path: urlData.path,
    agent: agent,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  };
  if (urlData.port) {
    reqOpts['port'] = urlData.port;
  }

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


function lightGET(options, cb) {
  var agent;
  if (options.proxy) {
    const proxyData = url.parse(options.proxy);
    var agent = new HttpsProxyAgent({
    host: proxyData.hostname,
    port: proxyData.port,
    secureProxy: proxyData.protocol === "https:"
    });
  }
  const urlData = url.parse(options.uri);

  const reqOpts = {
    host: urlData.hostname,
    method: "GET",
    path: urlData.path,
    agent,
  };

  if (urlData.port) {
    reqOpts['port'] = urlData.port;
  }

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
  
  req.end();

  return req;
}

module.exports = { formPOST, lightGET };
