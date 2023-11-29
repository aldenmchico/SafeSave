const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {


    // Proxy requests for /users/*
    app.use(
        '/users',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:3001',
            changeOrigin: true,
            secure: true
        })
    );

    // Proxy requests for /jwt-api/sign
    app.use(
        '/jwt-api',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8015',
            changeOrigin: true,
            secure: true
        })
    );

    // Proxy request for /api/check-2fa-enabled-and-real-secret
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8006',
            chanrgeOrigin: true,
            secure: true
        })
    )
}
