const request = require("request");
const { getNProxies } = require("./proxy-list");

async function tryReq(options, connections=30, retryTime=2000, retryTimes=10, idx=0) {
  const requests = [];
  return new Promise(async (res, rej) => {
    const randProxies = await getNProxies(connections);
    randProxies.forEach((proxy) => {
      const newOpts = Object.assign({ proxy }, options);
      const req = request(newOpts, (err, resp) => {
        if (!err) {
          res(resp.body);
          requests.forEach((r) => {
            r.abort();
            r.destroy();
          });
        }
      });
      requests.push(req);
    })
  });
}

module.exports = { tryReq };
