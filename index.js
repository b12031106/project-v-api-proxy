require('dotenv').config();
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const ROUTER_JSON_FILEPATH = `./.router.json`;

if (!fs.existsSync(ROUTER_JSON_FILEPATH)) {
    throw new Error('router.json not found.');
}
const router = JSON.parse(fs.readFileSync(ROUTER_JSON_FILEPATH, 'utf8'));
console.info(`router mapping:`, router);

const PORT = process.env.PORT;
const DELAY_MILLISECONDS = process.env.DELAY_MILLISECONDS || 0;

app.use(cors({
    origin: (origin, cb) => {
        cb(null, origin);
    },
    credentials: true
}));

app.use((req, res, next) => setTimeout(next, DELAY_MILLISECONDS));

app.use('/', (req, res, next) => {
    const requestHeaderHost = req.header(`host`);
    const filepathWithHost = `${__dirname}/mock/${requestHeaderHost}/${req.path}.json`;
    const filepathWithoutHost = `${__dirname}/mock/${req.path}.json`;;
    if (fs.existsSync(filepathWithHost)) {
        console.log(`load mock file from ${filepathWithHost}`);
        res.sendFile(filepathWithHost);
    } else if (fs.existsSync(filepathWithoutHost)) {
        console.log(`load mock file from ${filepathWithoutHost}`);
        res.sendFile(filepathWithoutHost);
    } else {
        console.log(`no mock file found, go target`);
        next();
    }
});

// Proxy endpoints
app.use('/', createProxyMiddleware({
    router,
    changeOrigin: true,
}));

// Start Proxy
app.listen(PORT, () => {
    console.log(`Starting Proxy at ${PORT}`);
});
