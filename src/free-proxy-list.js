const req = require("request");
const cheerio = require("cheerio");

const protocol = str => (str === 'yes' ? 'https://' : 'http://');

function fetchProxy() {
  const options = { uri: 'http://free-proxy-list.net/', method: 'GET' };
  return new Promise((resolve, rej) => {
    const reqInst = req(options, (error, resp, body) => {
      const $ = cheerio.load(resp.body);
      const addresses = $('#proxylisttable > tbody > tr')
      .map((i, el) => protocol($(el.children[6]).text()) + $(el.children[0]).text() + ':' + $(el.children[1]).text())
      .get();
      resp.destroy();
      resolve(addresses);
    });
    reqInst.on('connection', function (socket) {
      console.log('connected...');
      socket.on('error', (err) => {
        reqInst.end();
        reqInst.destroy();
        console.log('proper socket error handling');
      });
    });
    reqInst.end();
    reqInst.destroy();
  });
}

module.exports = fetchProxy;
