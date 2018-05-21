const request = require("request");
const { getNProxies, niceProxy, badProxy } = require("./proxy-list");
const { formPOST } = require("./light-request");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function tryFromPOST(options, connections = 10, timeout = 5000) {
  return new Promise(async (resolve, reject) => {
    const requests = [];
    const randProxies = await getNProxies(connections);
    const timeoutId = setTimeout(() => {
      reject("timeout");
      requests.forEach(r => {
        r.abort();
        r.destroy();
      });
    }, timeout);
    for (let i = 0; i < randProxies.length; i++) {
      const proxy = randProxies[i];
      const newOpts = Object.assign({ proxy, timeout }, options);
      const req = formPOST(newOpts, (err, data) => {
        if (!err) {
          requests.forEach(r => {
            r.abort();
            r.destroy();
          });
          niceProxy(proxy);
          clearTimeout(timeoutId);
          resolve(data);
        } else {
          badProxy(proxy);
        }
      });
      requests.push(req);
    }
  });
}

async function tryReq(options, connections = 10, timeout = 5000) {
  return new Promise(async (resolve, reject) => {
    const requests = [];
    const randProxies = await getNProxies(connections);
    setTimeout(() => {
      reject();
      requests.forEach(r => {
        r.abort();
        r.end();
        r.destroy();
      });
    }, timeout);
    for (let i = 0; i < randProxies.length; i++) {
      const proxy = randProxies[i];
      const newOpts = Object.assign({ proxy, timeout }, options);
      const req = request(newOpts, (err, resp) => {
        if (!err) {
          resolve(resp.body);
          requests.forEach(r => {
            r.abort();
            r.end();
            r.destroy();
          });
          resp.destroy();
        }
        req.end();
        req.destroy();
      });
      requests.push(req);
      const clear = () => {
        req.abort();
        req.end();
        req.destroy();
      };
      req.on("uncaughtException", clear);
      req.on("error", clear);
      req.on("timeout", clear);
    }
  });
}

module.exports = { tryReq, tryFromPOST };
