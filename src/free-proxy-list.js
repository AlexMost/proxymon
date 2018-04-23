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
      reqInst.end();
      reqInst.destroy();
      resolve(addresses);
    });
  });
}

module.exports = fetchProxy;
