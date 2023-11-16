import 'dotenv/config';
import express from 'express';
import * as twoFACodeModel from './two-factor-authentication-code-model.mjs';
import qrcode from 'qrcode';
import cors from 'cors';

import { checkAuth } from '../middlewares/checkAuth.mjs';

import cookieparser from 'cookie-parser';
import path from 'path';


// HTTPS
import https from 'https';
import { readFileSync } from 'fs';

// Obtain __dirname in an ES module
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKeyPath = path.resolve(__dirname, 'key.pem');
const certificatePath = path.resolve(__dirname, 'cert.pem');

let privateKey;
let certificate;

try {
    privateKey = readFileSync(privateKeyPath, 'utf8');
    certificate = readFileSync(certificatePath, 'utf8');
} catch (error) {
    console.error('Error reading SSL certificate files:', error);
    process.exit(1);
}

const creds = { key: privateKey, cert: certificate };

// Configure express server
const PORT = process.env.PORT;
const app = express();

app.use(cookieparser());
app.use(express.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Enable All CORS Requests from any origin and allow server to accept cookies from client
const allowedOrigins = ['https://localhost:3000', 'https://127.0.0.1:3000', 'https://107.181.189.57:7263', 'https://192.168.88.79:3000', 'https://107.181.189.57:7263'];

app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the list of allowed origins or if it's a browser preflight request
        const isAllowed = allowedOrigins.some(allowedOrigin =>
            new RegExp(allowedOrigin).test(origin)
        );

        if (isAllowed || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


app.get('/api', checkAuth, (req, res) => {
    /*
    Dummy /api endpoint 
    */

    console.log(req.user);

    res.status(200).json({ message: 'Welcome to 2FA controller!' });
})

app.post('/api/2fa-registration', checkAuth, async (req, res) => {
    /*
    generates and stores a temporary secret given a userId
    */

    // grab user from stored Cookie
    const { userUsername, userID } = req.user
    const { enableTwoFactor } = req.body

    console.log(`enableTwoFactor is: ${enableTwoFactor}`);

    // If the request is to disable 2FA
    if (!enableTwoFactor) {
        try {
            const twoFADisabled = twoFACodeModel.disableTwoFactor(userID);
            if (!twoFADisabled) {
                return res.status(400).json({ message: `Something went wrong trying to disable 2FA for userID ${userID}` });
            }
            return res.status(200).json({ message: `2FA was disabled for userId ${userID}` });
        } catch (error) {
            return res.status(500).json({ message: "Error in process of disabling 2FA." });
        }
    }

    try {
        const temp_secret = twoFACodeModel.generateAndStoreTempSecretToken(userID);
        if (!temp_secret) {
            return res.status(400).json({ message: 'Something went wrong trying to generate and store temp token' });
        }
        return res.status(200).json({
            message: "2-FA registration successfully initiated - stored temp secret. Proceed to verify token."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error generating secret" })
    }
})

app.get('/api/check-2fa-enabled-and-real-secret', checkAuth, async (req, res) => {
    /*
    Checks if Cookie user has 2FA enabled and Real Secret already established
    - If no real secret, they have not yet verified 2fa setup. 
    - If both enabled, then they are set up. 
    */

    const { userUsername } = req.user
    try {
        const verified = await twoFACodeModel.checkIfUserHas2FAEnabledAndRealSecret(userUsername);

        if (!verified) {
            return res.status(200).json({ verified: false });
        }
        return res.status(200).json({ verified: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error checking if User has 2FA Enabled and Real Secret." })
    }
})

app.get('/api/check-2fa-enabled-and-no-secret', checkAuth, async (req, res) => {
    /*
    Checks if Cookie user has 2FA enabled and Real Secret already established
    - If no real secret, they have not yet verified 2fa setup. 
    - If both enabled, then they are set up. 
    */

    const { userUsername } = req.user
    try {
        const has2FAAndNoSecret = await twoFACodeModel.checkIfUserHas2FAEnabledAndNoSecret(userUsername);

        if (!has2FAAndNoSecret) {
            return res.status(200).json({ has2FAAndNoSecret: false });
        }
        return res.status(200).json({ has2FAAndNoSecret: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error checking if User has 2FA Enabled and No Secret." })
    }
})



app.post('/api/verify-2fa-setup-token', checkAuth, async (req, res) => {
    /*
    Verifies temporary secret token.
    On success, overwrites 'temp_secret' --> 'secret'.
    */

    // grab user's ID from Cookie
    const { userID } = req.user

    // grab token / secret from client 
    const { token, secret } = req.body;

    try {

        // verify that token from authenticator is same as token generated using secret -  make temporary token, permanent for user
        const verified = await twoFACodeModel.verifyTemporaryTOTP(userID, token, secret)

        if (verified) {
            return res.status(200).json({ verified: true });
        }
        return res.status(200).json({ verified: false });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error verifying token" })
    }
})

app.post('/api/generate-mfa-qr-code', checkAuth, async (req, res) => {
    /*
    Generates QR code for 2FA setup so user doesn't have to use put in secret into authenticator. 
    */

     // grab user's ID from Cookie
     const { userID, userUsername } = req.user

    // username is from the authenticator - NOT user's username
    const { mfaEnabled, mfaSecret, username } = req.body;

    // For security, we no longer show the QR code if already verified
    // if (mfaEnabled) return res.status(404).json({ message: "mfa is already enabled " });

    // Ensure that the mfaSecret is provided
    if (!mfaSecret) {
        return res.status(400).json({ message: "No MFA secret provided" });
    }

    // qr code config 
    const issuer = 'port11';
    const algorithm = 'SHA1';
    const digits = '6';
    const period = '30';
    const otpType = 'totp';
    const configUri = `otpauth://${otpType}/${issuer}:${username}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${mfaSecret}`;

    // generate qr code
    res.setHeader('Content-Type', 'image/png');
    return qrcode.toFileStream(res, configUri);
});

app.post('/api/verify-2fa-login-token', checkAuth, (req, res) => {
    /*  
    Verifies the token received when user tries logging into app.
    Assumes 2FA is already set up and user has an account setup.
    */

    const { token, secret } = req.body;
    const { userID, user2FAEnabled } = req.user

    // check if 2FA is even enabled
    if (!user2FAEnabled) {
        return res.status(400).json({ message: "2FA is not enabled." });
    }

    // Check for required fields
    if (!userID || !token || !secret) {
        return res.status(400).json({ message: "UserId and token and secret are required." });
    }

    // Verify the provided token against the user's stored secret
    const isValid = twoFACodeModel.verifyAuthenticatedTOTP(token, secret);

    if (isValid) {
        // If the 2FA verification is successful, respond accordingly
        // Here you might also want to establish a session or generate an access token
        return res.status(200).json({ message: "Token was validated.", verified: true });
    }
    return res.status(401).json({ message: "Invalid 2FA token.", verified: false });

});


const httpsServer = https.createServer(creds, app);

httpsServer.listen(PORT, () => {
    console.log(`2Factor server listening on port ${PORT}...`);
});

/* 

Eugene's Notes: (Will remove later) 

// import { v4 as uuidv4 } from 'uuid';
  // const id = uuidv4();

*/