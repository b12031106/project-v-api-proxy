const express = require('express');
const res = require('express/lib/response');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require("fs");
const path = require('path');


const app = express();
const defaultOrigin = `https://local.dev.buy123.com.tw:3000`;
app.use((req, res, next) => {
    const origin = req.get(`origin`) || defaultOrigin;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.get('/flashsale/tabs', (req, res) => {
    res.sendFile(path.resolve('./mocks/flashsale/tabs.json'));
});
app.get('/orders/success/:orderId', (req, res) => {
    res.sendFile(path.resolve('./mocks/orders/success.json'));
});
app.get('/events/checkin/:checkinId', (req, res) => {
    res.sendFile(path.resolve('./mocks/events/checkin.json'));
});

app.use('/', createProxyMiddleware({
    target: 'https://x-server-test.buy123.com.tw',
    // target: 'https://pp-xapi.buy123.com.tw',
    // target: `https://bj-kuo-24hr-2-traefik.dev-x.kuobrothers.com`,
    // target: `https://justin_hsu-kuo-24hr-traefik.dev-x.kuobrothers.com/`,
    // ssl: httpsOptions,
    changeOrigin: true,
    // cookieDomainRewrite: 'buy123.com.tw',
    // secure: true,
    onProxyReq(proxyReq, req) {
        if (req.headers['cookie']) {
            proxyReq.setHeader('cookie', req.headers['cookie']);
        }
        return;
        if (req.headers['cookie']) {
            let cookie = req.headers['cookie'];
            const authToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNjQ2OTU0LCJtZXRob2QiOiJidXkxMjMiLCJ2ZW5kb3JfY29va2llc19oYXNoIjoiYjE0ODlkNWY2MDlhNTNiOTIxYzZhMzRlOWE0ZGIwMWEiLCJ2ZW5kb3JfaW5mbyI6eyJpZCI6Ijg2MzY5OTMiLCJlbWFpbCI6Imp1c3Rpbi5oc3VAa3VvYnJvdGhlcnMuY29tIiwiZW1haWxfaGFzaF9zaGEyNTYiOiIzZTczOWRkZTc0NmY1ZGQ3ZDhiM2Q1MTNkMzE0M2ZmMTg1OGMxZjAzNWFhZTdiMTQ3YzYwYzgwN2IwZjczYWExIiwiZW1haWxfaGFzaF9tZDUiOiI3MmRlZjE2Nzc0Yzk0OTJkOTFhOWY5M2M5ZmJjMDZmNCIsInBob25lIjpudWxsLCJwaG9uZV9oYXNoX3NoYTI1NiI6bnVsbCwicGhvbmVfaGFzaF9tZDUiOm51bGx9LCJ1c2VyX2FjY291bnRzIjpbeyJtZXRob2QiOiJwY29uZSIsInZlbmRvcl91c2VyX2lkIjoiNTM3MTg5NyJ9LHsibWV0aG9kIjoiYnV5MTIzIiwidmVuZG9yX3VzZXJfaWQiOiI4NjM2OTkzIn1dfQ.7U8gDCytspSn29cwxiHW8pSagv2pHlW_0PuWCTXKoGY`;
            const userToken = `d90065f6-a991-11ec-9ecd-0aff1d86ef8d`;
            const deviceHash = `621476daf146a74d3af6558e`;
            const xDeviceHash = `62146a56ab596f019d440d0a`;
            const uidHash = `5888977e15bf8ce91987c76e41fc27989baedd9c0d3137b5bedce429b1b4b844ce36b10d8eed8e4be5aa238dc9b63632511911da5c9507a3fa31edafecd20933`;
            const uid = `8636993`;
            cookie += `; uid_hash=${uidHash}; uid=${uid}`;
            cookie += `; device_hash=${deviceHash}; x_device_hash=${xDeviceHash}`;
            cookie += `; auth_token=${authToken}; user_token=${userToken}`;
            console.log(`found cookie`,  cookie);
            proxyReq.setHeader('cookie', cookie);
        }
    },
    onProxyRes(proxyRes, req, res) {
        return;
        const origin = `http://local.dev.buy123.com.tw:3000`;
        delete proxyRes.headers[`Access-Control-Allow-Origin`];
        proxyRes.headers['Access-Control-Allow-Origin'] = origin;
        console.log(`origin ${origin}`);
        // console.log(res);
    }
}));
app.listen(3001);