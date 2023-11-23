import 'dotenv/config';
import express from 'express';
import * as twoFACodeModel from './two-factor-authentication-code-model.mjs';
import qrcode from 'qrcode';
import cors from 'cors';
import * as db from './db-connector.mjs';
var con = mysql.createConnection(db.dbConfig);


import { checkAuth } from '../middlewares/checkAuth.mjs';

import cookieparser from 'cookie-parser';
import path from 'path';


// HTTPS
import https from 'https';
import { readFileSync } from 'fs';

// Obtain __dirname in an ES module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql from "mysql";


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

    res.status(200).json({ message: 'Welcome to 2FA controller!' });
})

app.post('/api/2fa-registration', checkAuth, async (req, res) => {
    /*
    generates and stores a temporary secret given a userId
    */

    // grab userID from stored Cookie
    const accessToken = req.cookies.access_token
    const { userID } = req.user
    const { enableTwoFactor } = req.body

    console.log(`enableTwoFactor is: ${enableTwoFactor}`);



    // If the request is to disable 2FA
    if (!enableTwoFactor) {
        try {
            const twoFADisabled = await twoFACodeModel.disableTwoFactor(userID, accessToken);
            if (!twoFADisabled) {
                return res.status(400).json({ message: `Something went wrong trying to disable 2FA for userID ${userID}` });
            }
            return res.status(200).json({ message: `2FA was disabled for userId ${userID}` });
        } catch (error) {
            return res.status(500).json({ message: "Error in process of disabling 2FA." });
        }
    }

    try {
        const temp_secret = await twoFACodeModel.generateAndStoreTempSecretToken(userID, accessToken);
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

const getUserHMAC = (userID) => {
    return new Promise((resolve, reject) => {
        const hmacQuery = `SELECT userHMAC FROM Users WHERE userID = ?`;
        con.query(hmacQuery, [userID], (err, result) => {
            if (err) {
                reject(err);
            } else {
                const userHMAC = result[0] ? result[0].userHMAC : null;
                resolve(userHMAC);
            }
        });
    });
};


app.get('/api/check-2fa-enabled', checkAuth, async (req, res) => {
    /*
    Checks if Cookie user has 2FA enabled and Real Secret already established
    - If no real secret, they have not yet verified 2fa setup. 
    - If both enabled, then they are set up. 
    */

    const { userUsername, userID } = req.user
    try {

        const userHMAC = await getUserHMAC(userID)

        console.log(`THE HMAC CALLED IN 2fa AUTH CONTROLLER IS ${userHMAC}`);
        const verified = await twoFACodeModel.checkIfUserHas2FAEnabled(userHMAC);

        if (!verified) {
            return res.status(200).json({ verified: false });
        }
        return res.status(200).json({ verified: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error checking if User has 2FA Enabled." })
    }
})

app.get('/api/check-2fa-enabled-and-no-secret', checkAuth, async (req, res) => {
    /*
    Checks if Cookie user has 2FA enabled and Real Secret already established
    - If no real secret, they have not yet verified 2fa setup. 
    - If both enabled, then they are set up. 
    */

    const { userUsername, userID } = req.user
    try {

        const userHMAC = await getUserHMAC(userID)
        const has2FAAndNoSecret = await twoFACodeModel.checkIfUserHas2FAEnabledAndNoSecret(userHMAC);

        if (!has2FAAndNoSecret) {
            return res.status(200).json({ has2FAAndNoSecret: false });
        }
        return res.status(200).json({ has2FAAndNoSecret: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error checking if User has 2FA Enabled and No Secret." })
    }
})

app.get('/api/check-2fa-enabled-and-real-secret-established', checkAuth, async (req, res) => {
    /*
    Checks if Cookie user has 2FA enabled and Real Secret already established
    */

    const { userUsername, userID } = req.user
    try {

        const userHMAC = await getUserHMAC(userID)

        console.log(`THE HMAC CALLED IN 2fa AUTH CONTROLLER IS ${userHMAC}`);
        const verified = await twoFACodeModel.checkIfUserHas2FAAndSecretEstablished(userHMAC);

        if (verified) {
            return res.status(200).json({ verified: true });
        }
        return res.status(200).json({ verified: false });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error checking if User has 2FA Enabled and Real Secret." })
    }
});


const getUserTempSecret = (userID) => {

    return new Promise((resolve, reject) => {
        const tempSecretQuery = `SELECT userTempSecret FROM Users WHERE userID = ?`;

        const values = []
        values.push(userID)
        con.query(tempSecretQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                const userTempSecret = result[0] ? result[0].userTempSecret : null;
                console.log('Retrieved userSessionID:', userTempSecret);
                resolve(userTempSecret);
            }
        });
    });
};

const getUserSecret = (userID) => {

    return new Promise((resolve, reject) => {
        const userSecretQuery = `SELECT userSecret FROM Users WHERE userID = ?`;

        const values = []
        values.push(userID)
        con.query(userSecretQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                const userSecret = result[0] ? result[0].userSecret : null;
                console.log('Retrieved userSessionID:', userSecret);
                resolve(userSecret);
            }
        });
    });
};

const getUser2faEnabled = (userID) => {

    return new Promise((resolve, reject) => {
        const twoFAQuery = `SELECT user2FAEnabled FROM Users WHERE userID = ?`;

        const values = []
        values.push(userID)
        con.query(twoFAQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                const user2FAEnabled = result[0] ? result[0].user2FAEnabled : null;
                console.log('Retrieved userSessionID:', user2FAEnabled);
                resolve(user2FAEnabled);
            }
        });
    });
};

app.post('/api/verify-2fa-setup-token', checkAuth, async (req, res) => {
    /*
    Verifies temporary secret token.
    On success, overwrites 'temp_secret' --> 'secret'.
    */

    // grab user's ID from Cookie
    const { userID, userUsername } = req.user

    // grab token from client 
    const { token } = req.body;

    try {

        const userHMAC = await (getUserHMAC(req.user.userID))

        // pull user data from db
        const userData = await twoFACodeModel.returnUserDataByUsername(userHMAC);

        if (!userData) return res.status(400).json({ message: "Invalid User - ensure Cookies are valid" });

        // get tempsecret , 2faenabled using Cookie
        const tempSecret = await getUserTempSecret(userData[0].userID)
        const user2FAEnabled = await getUser2faEnabled(userData[0].userID)

        const accessToken = req.cookies.access_token

        console.log(`In verify-2fa-setup-token mfaTempSecret is ${tempSecret} and mfaEnabled is ${user2FAEnabled}`);


        // check if 2FA is even enabled
        if (!user2FAEnabled) {
            return res.status(400).json({ message: "2FA is not enabled." });
        }

        // Check for required fields
        if (!userID || !token || !tempSecret) {
            return res.status(400).json({ message: "Username and token and tempSecret are required." });
        }

        // verify that token from authenticator is same as token generated using secret -  make temporary token, permanent for user
        const verified = await twoFACodeModel.verifyTemporaryTOTP(userID, token, tempSecret, 2, accessToken)

        if (verified) {
            // Here you might also want to establish a session or generate an access token
            return res.status(200).json({ message: "Token was validated.", verified: true });
        }
        return res.status(200).json({ verified: false });
        // return res.status(401).json({ message: "Invalid 2FA token.", verified: false });

    } catch (error) {
        console.log('Error in returnUserDataByUsername in 2FA Setup Token , Controller');
        res.status(500).json({ message: "Error verifying 2FA Setup token" })
    }
})

app.get('/api/generate-mfa-qr-code', checkAuth, async (req, res) => {
    /*
    Generates QR code for 2FA setup so user doesn't have to use put in secret into authenticator. 
    */

    // grab user's ID from Cookie
    const { userID, userUsername } = req.user

    try {

        const userHMAC = await (getUserHMAC(req.user.userID))
        const userData = await twoFACodeModel.returnUserDataByUsername(userHMAC);

        if (!userData) return res.status(400).json({ message: "Invalid User - ensure Cookies are valid" });

        const mfaSecret = await getUserSecret(userData[0].userID)
        const mfaTempSecret = await getUserTempSecret(userData[0].userID)
        const mfaEnabled =  await getUser2faEnabled(userData[0].userID)

        console.log(`mfaSecret is ${mfaSecret} mfaTempSecret is ${mfaTempSecret} and mfaEnabled is ${mfaEnabled}`);

        // For security, we no longer show the QR code if already verified
        if (mfaEnabled && mfaSecret) return res.status(404).json({ message: "2FA is already enabled " });

        // Ensure that the mfaSecret is provided
        if (!mfaTempSecret) {
            return res.status(400).json({ message: "Invalid Temp Secret. Ensure User is logged in (Cookies)" });
        }

        // qr code config 
        const issuer = 'SafeSave';
        const algorithm = 'SHA1';
        const digits = '6';
        const period = '30';
        const otpType = 'totp';
        const configUri = `otpauth://${otpType}/${issuer}:${userID}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${mfaTempSecret}`;

        // generate qr code
        res.setHeader('Content-Type', 'image/png');
        return qrcode.toFileStream(res, configUri);
    } catch (error) {
        console.error('Error in /api/generate-mfa-qr-code');
        res.status(500).json({ message: "Error generating QR Code in Controller" })
    }
});

const getUserName = (userID) => {

    return new Promise((resolve, reject) => {
        const userNameQuery = `SELECT userHMAC FROM Users WHERE userID = ?`;

        const values = []
        values.push(userID)
        con.query(userNameQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                const userHMAC = result[0] ? result[0].userHMAC : null;
                console.log('Retrieved userSessionID:', userHMAC);
                resolve(userHMAC);
            }
        });
    });
};

app.post('/api/verify-2fa-login-token', checkAuth, async (req, res) => {
    /*  
    Verifies the token received when user tries logging into app.
    Assumes 2FA is already set up and user has an account setup.
    */

    // get secret , 2faenabled, id from req.user
    // get token from user input in body
    const { token } = req.body;

    try {

        const userHMAC = await (getUserHMAC(req.user.userID))
        // pull user data from db
        const userData = await twoFACodeModel.returnUserDataByUsername(userHMAC);


        if (!userData) return res.status(400).json({ message: "Invalid User - ensure Cookies are valid" });

        const secret = await getUserSecret(userData[0].userID)
        const user2FAEnabled = await getUser2faEnabled(userData[0].userID)

        console.log(`userSecret[0].userSecret in /api/verify-2fa-login-token is ${secret}`);

        const userUserName = await getUserName(userData[0].userID)


        // check if 2FA is even enabled
        if (!user2FAEnabled) {
            return res.status(400).json({ message: "2FA is not enabled." });
        }

        // Check for required fields
        if (!userUserName || !token || !secret) {
            return res.status(400).json({ message: "Username and token and secret are required." });
        }

        // Verify the provided token against the user's stored secret
        const isValid = twoFACodeModel.verifyAuthenticatedTOTP(token, secret);

        if (isValid) {
            // If the 2FA verification is successful, respond accordingly
            // Here you might also want to establish a session or generate an access token
            return res.status(200).json({ message: "Token was validated.", verified: true });
        }
        return res.status(401).json({ message: "Invalid 2FA token.", verified: false });

    } catch (error) {
        console.log('Error in returnUserDataByUsername in 2FA Controller');
        res.status(500).json({ message: "Error verifying 2-FA login token" });
    }

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