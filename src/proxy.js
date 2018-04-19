const log = require('why-is-node-running') // should be your first require
const ah = require('active-handles');
const request = require("request");
const fetchProxy = require("./free-proxy-list");
const { Observable, Observer } = require('rxjs');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function obsRequest(options, proxy) {
  options.proxy = proxy;
  return Observable.create((observer) => {
    const req = request(options, (err, res) => {
      if (err) {
        req.destroy();
        observer.error(err);
      } else {
        observer.next(res.body);
      }
      observer.complete();
    });
    return () => {
      req.abort();
      req.end();
      req.destroy();
    }
  })
}

async function idRequest(options) {
  const proxies = await fetchProxy();
  const randProxies = [];
  for (let i = 0; i <= 30; i++) {
    randProxies.push(proxies[getRandomInt(proxies.length)]);
  }
  return new Promise((res, rej) => {
    const subs = Observable
    .from(randProxies)
    .flatMap((proxy) => obsRequest(options, proxy).onErrorResumeNext(Observable.empty()))
    .first()
    .timeout(2000)
    .subscribe((data) => {
      res(data);
      subs.unsubscribe();
    }, (err) => rej(err));
  });
}

idRequest({method: 'GET', uri: 'https://booking.uz.gov.ua/train_search/station/?term=%D0%9A%D0%B8%D1%97%D0%B2' })
.then((data) => {
  // log();
  // ah.print();
  console.log(data);
});
