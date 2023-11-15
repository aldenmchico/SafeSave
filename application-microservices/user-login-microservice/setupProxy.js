const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {


    // Proxy requests for /users/*
    app.use(
        '/users',
        createProxyMiddleware({
            target: 'https://localhost:3001',
            changeOrigin: true,
            secure: false
        })
    );

    // Proxy requests for /jwt-api/sign
    app.use(
        '/jwt-api',
        createProxyMiddleware({
            target: 'https://localhost:8015',
            changeOrigin: true,
            secure: false
        })
    );
}