require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT;
const HOST = `localhost`;
const TARGET_HOST = process.env.TARGET_HOST;
const DELAY_MILLISECONDS = process.env.DELAY_MILLISECONDS || 0;

app.use(cors({
    origin: (origin, cb) => {
        cb(null, origin);
    },
    credentials: true
}));

app.use((req, res, next) => setTimeout(next, DELAY_MILLISECONDS));

app.use('/', (req, res, next) => {
    const mockFilepath = `${__dirname}/mock/${req.path}.json`;
    res.sendFile(mockFilepath, () => {
        next();
    });
});

// Proxy endpoints
app.use('/', createProxyMiddleware({
    target: TARGET_HOST,
    changeOrigin: true,
}));

// Start Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
