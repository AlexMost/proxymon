const req = require("request");
const cheerio = require("cheerio");

const protocol = str => (str === 'yes' ? 'https://' : 'http://');

function fetchProxy() {
  const options = { uri: 'http://free-proxy-list.net/', method: 'GET' };
  return new Promise((res, rej) => {
    req(options, (error, resp, body) => {
      const $ = cheerio.load(resp.body);
      const addresses = $('#proxylisttable > tbody > tr')
      .map((i, el) => protocol($(el.children[6]).text()) + $(el.children[0]).text() + ':' + $(el.children[1]).text())
      .get();
      res(addresses);
    });
  });
}

module.exports = fetchProxy;
