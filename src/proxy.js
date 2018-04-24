const request = require("request");
const { getNProxies } = require("./proxy-list");

async function tryReq(options, connections=10, timeout=5000) {
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
    }, timeout);
    for (let i = 0; i < randProxies.length; i++) {
      const proxy = randProxies[i];
      const newOpts = Object.assign({ proxy, timeout }, options);
      const req = request(newOpts, (err, resp) => {
        if (!err) {
          resolve(resp.body);
          console.log('works >>>>', proxy);
          requests.forEach((r) => {
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
      }
      req.on('uncaughtException', clear);
      req.on('error', clear);
      req.on('timeout', clear);
    }
  });
}

module.exports = { tryReq };
