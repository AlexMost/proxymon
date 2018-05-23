const request = require("request");
const { getNProxies, niceProxy, badProxy } = require("./proxy-list");
const { formPOST, lightGET } = require("./light-request");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function executeRequest(reqFun, options, connections, timeout) {
  return new Promise(async (resolve, reject) => {
    const requests = [];
    const k = (timeout / 1000);
    const randProxies = await getNProxies(connections);
    const start = new Date();
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
      const req = reqFun(newOpts, (err, data) => {
        if (!err) {
          requests.forEach(r => {
            r.abort();
            r.destroy();
          });
          const end = new Date();
          const diffTime = (end - start) / 1000;
          niceProxy(proxy, k - diffTime);
          clearTimeout(timeoutId);
          resolve(data);
        } else {
          if (err !== 'timeout') {
            badProxy(proxy, k);
          }
        }
      });
      requests.push(req);
    }
  });
}

async function tryFromPOST(options, connections = 10, timeout = 5000) {
  return executeRequest(formPOST, options, connections, timeout);
}

async function tryGET(options, connections = 10, timeout = 5000) {
  return executeRequest(lightGET, options, connections, timeout);
}

async function callUntillSuccess(tryFn, options, connections, timeout, c = 0) {
  try {
    const result = await tryFn(options, connections, timeout);
    return result;
  } catch (err) {
    if (c < 30) {
      return callUntillSuccess(tryFn, options, connections, timeout, c+1);
    } else {
      throw `Failed to make request ${options}`
    }
  }
}

async function postForm(options, connections=10, timeout = 5000) {
  return callUntillSuccess(tryFromPOST, options, connections, timeout);
}

async function get(options, connections=10, timeout=5000) {
  return callUntillSuccess(tryGET, options, connections, timeout);
}

module.exports = { tryFromPOST, postForm, get, tryGET };
