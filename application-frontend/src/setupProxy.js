const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Proxy requests for /login/validation
    app.use(
        '/loginvalidation',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8008',
            changeOrigin: true,
            secure: true
        })
    );

    app.use(
        '/create',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8008',
            changeOrigin: true,
            secure: true
        })
    );


    //Proxy server for 2fa api

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8006',
            changeOrigin: true,
            secure: true
        })
    )

    // // proxy for /api/generate-mfa-qr-code (called from TwoFactorAuthPage)
    // app.use(
    //     '/api/generate-mfa-qr-code',
    //     createProxyMiddleware({
    //         target: 'https://localhost:8006',
    //         changeOrigin: true,
    //         secure: true,
    //     })
    // )


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
        '/jwt-api/sign',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8015',
            changeOrigin: true,
            secure: true
        })
    );


    app.use(
        '/login_items',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:3001',
            changeOrigin: true,
            secure: true, // Ignore SSL certificate validation (for development only)
        })
    );

    app.use(
        '/notes',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:3001',
            changeOrigin: true,
            secure: true, // Ignore SSL certificate validation (for development only)
        })
    );

    // proxy for /api/check-2fa-enabled-and-real-secret (called from SettingsPage)
    // app.use(
    //     '/api/check-2fa-enabled-and-real-secret',
    //     createProxyMiddleware({
    //         target: 'https://localhost:8006',
    //         changeOrigin: true,
    //         secure: true,
    //     })
    // )

    app.use(
        '/ciphertext',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8002',
            changeOrigin: true,
            secure: true,
        })
    )

    app.use(
        '/logout',
        createProxyMiddleware({
            target: 'https://safesave.ddns.net:8008',
            changeOrigin: true,
            secure: true,
        })
    )



};
