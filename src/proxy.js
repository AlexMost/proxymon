const request = require("request");
const { getNProxies } = require("./proxy-list");

async function tryReq(options, connections=10, retryTime=2000, retryTimes=10, idx=0) {
  return new Promise(async (resolve, reject) => {
    const requests = [];
    const randProxies = await getNProxies(connections);
    setTimeout(() => {
      reject();
      requests.forEach((r) => {
        r.abort();
        r.end();
        r.destroy();
      });
    }, 3000);
    for (let i = 0; i < randProxies.length; i++) {
      const proxy = randProxies[i];
      const newOpts = Object.assign({ proxy, timeout: 3000 }, options);
      const req = request(newOpts, (err, resp) => {
        if (!err) {
          resolve(resp.body);
          requests.forEach((r) => {
            r.abort();
            r.end();
            r.destroy();
          });
          resp.destroy();
        }
        req.abort();
        req.end();
        req.destroy();
      });
      requests.push(req);
      const clear = () => {
        req.abort();
        req.end();
        req.destroy();
      }
      req.on('uncaughtException', clear);
      req.on('error', clear);
      req.on('timeout', clear);
      req.end();
      req.destroy();
    }
  });
}

module.exports = { tryReq };
