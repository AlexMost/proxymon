const fetchProxy = require("./free-proxy-list");

let proxies = [];
let proxyWeights = {};
let startedUpdate = false;
let updInterval = 1000 * 60 * 5;

let awaitProxy = null;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function startUpdate() {
    if (!startedUpdate) {
        startedUpdate = true;
        setInterval(async () => {
            proxies = await fetchProxy();
        }, updInterval);
    }
}

async function getNProxies(n=10) {
    const randProxies = [];
    if (!proxies.length) {
        startUpdate();
        if (awaitProxy) {
            proxies = await awaitProxy;
        } else {
            awaitProxy = fetchProxy();
            proxies = await awaitProxy;
        }
    }
    for (let i = 0; i <= n; i++) {
        randProxies.push(proxies[getRandomInt(proxies.length)]);
    }
    return randProxies;
}

function niceProxy(proxy) {

}

function badProxy(proxy) {

}

function setUpdInterval(interval) {
    updInterval(interval);
}

module.exports = { getNProxies, niceProxy, badProxy, setUpdInterval }
