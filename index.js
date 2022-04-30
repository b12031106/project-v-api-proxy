require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT;
const HOST = `localhost`;
const TARGET_HOST = process.env.TARGET_HOST;

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
