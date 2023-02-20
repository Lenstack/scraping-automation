const PROXIES = [
    //"http://72.44.68.249:1994"
];

const PROXY = PROXIES[Math.floor(Math.random() * PROXIES.length)];

module.exports = {
    PROXY
}