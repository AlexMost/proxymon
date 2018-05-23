const fetchProxy = require("./free-proxy-list");

let proxies = [];
let proxyWeights = {};
let startedUpdate = false;
let updInterval = 1000 * 60 * 30;
let IS_GOOD_SCORE = 200;
const BOUNDARY_SCORE = IS_GOOD_SCORE + 100;
let awaitProxy = null;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function startUpdate() {
    if (!startedUpdate) {
        startedUpdate = true;
        setInterval(async () => {
            const updProxies = await fetchProxy();
            const goodProxies = proxies.filter((p) => proxyWeights[p] > 0);
            Object.keys(proxyWeights).forEach((k) => {
                if (proxyWeights[k] < 0) {
                    delete proxyWeights[k];
                }
            });
            proxies = [...new Set(goodProxies.concat(updProxies))];
            console.log(`Proxies were updated. new - ${updProxies.length}. good - ${goodProxies.length}`);
        }, updInterval);
    }
}

function sort(proxies) {
    return proxies.sort((p1, p2) => {
        const p1W = proxyWeights[p1] || 0;
        const p2W = proxyWeights[p2] || 0;
        return p2W - p1W;
    });
}

async function getNProxies(n=10) {
    let randProxies = [];
    const halfN = n/2;
    const sorted = sort(proxies);
    const goodProxies = sorted.filter((p) => proxyWeights[p] > IS_GOOD_SCORE);
    if (goodProxies.length) {
        const goodProxy = goodProxies[getRandomInt(goodProxies.length)];
        return [goodProxy];
    }
    randProxies = randProxies.concat(sorted.slice(0, halfN));
    if (!proxies.length) {
        startUpdate();
        if (awaitProxy) {
            proxies = await awaitProxy;
        } else {
            awaitProxy = fetchProxy();
            proxies = await awaitProxy;
        }
    }
    for (let i = 0; i <= n/2; i++) {
        randProxies.push(proxies[getRandomInt(proxies.length)]);
    }
    return randProxies;
}

function niceProxy(proxy, score = 1) {
    if (proxyWeights[proxy]) {
        if (proxyWeights[proxy] < BOUNDARY_SCORE) {
            proxyWeights[proxy] += score;
        }
    } else {
        proxyWeights[proxy] = score;
    }
    console.log(`Nice proxy ${proxy} weight: ${proxyWeights[proxy]} score: ${score}`);
}

function badProxy(proxy, score) {
    if (proxyWeights[proxy]) {
        if (proxyWeights[proxy] > -BOUNDARY_SCORE) {
            proxyWeights[proxy] -= score;
        }
    } else {
        proxyWeights[proxy] = -score;
    }
    // console.log(`Bad proxy ${proxy} ${proxyWeights[proxy]}`);
}

function setUpdInterval(interval) {
    updInterval(interval);
}

module.exports = { getNProxies, niceProxy, badProxy, setUpdInterval }
