const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Proxy requests for /login/validation
    app.use(
        '/loginvalidation',
        createProxyMiddleware({
            target: 'https://localhost:8008',
            changeOrigin: true,
            secure: false
        })
    );

    app.use(
        '/create',
        createProxyMiddleware({
            target: 'https://localhost:8008',
            changeOrigin: true,
            secure: false
        })
    );


    //Proxy server for 2fa api

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://localhost:8006',
            changeOrigin: true,
            secure: false
        })
    )

    // // proxy for /api/generate-mfa-qr-code (called from TwoFactorAuthPage)
    // app.use(
    //     '/api/generate-mfa-qr-code',
    //     createProxyMiddleware({
    //         target: 'https://localhost:8006',
    //         changeOrigin: true,
    //         secure: false,
    //     })
    // )


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
        '/jwt-api/sign',
        createProxyMiddleware({
            target: 'https://localhost:8015',
            changeOrigin: true,
            secure: false
        })
    );


    app.use(
        '/login_items',
        createProxyMiddleware({
            target: 'https://localhost:3001',
            changeOrigin: true,
            secure: false, // Ignore SSL certificate validation (for development only)
        })
    );

    app.use(
        '/notes',
        createProxyMiddleware({
            target: 'https://localhost:3001',
            changeOrigin: true,
            secure: false, // Ignore SSL certificate validation (for development only)
        })
    );

    // proxy for /api/check-2fa-enabled-and-real-secret (called from SettingsPage)
    // app.use(
    //     '/api/check-2fa-enabled-and-real-secret',
    //     createProxyMiddleware({
    //         target: 'https://localhost:8006',
    //         changeOrigin: true,
    //         secure: false,
    //     })
    // )

    app.use(
        '/ciphertext',
        createProxyMiddleware({
            target: 'https://localhost:8002',
            changeOrigin: true,
            secure: false,
        })
    )

    app.use(
        '/logout',
        createProxyMiddleware({
            target: 'https://localhost:8008',
            changeOrigin: true,
            secure: false,
        })
    )



};
