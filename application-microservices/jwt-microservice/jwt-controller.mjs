import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

import * as jwtModel from './jwt-model.mjs';

import https from 'https';
import { readFileSync } from 'fs';

// Obtain __dirname in an ES module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import crypto from 'crypto';

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

const httpsServer = https.createServer(creds, app);

app.use(express.json());
app.use(cookieparser());

// Enable All CORS Requests
app.use(cors({ origin: 'https://localhost:3000', credentials: true }));

// app.use(cors());

app.get('/jwt-api', cors(), async (req, res) => {
    res.status(200).json({ message: 'Welcome to jwt-controller!' });
})

app.get('/jwt-api/cookies', function (req, res) {
    /*
    Function to list all cookies
    */
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
})

app.post('/jwt-api/sign', cors(), (req, res) => {
    /*
    Function to create, sign and return JWT in a cookie 
    */

    const { user } = req.body   // grab User from login-controller - only time I ask for User (curr only sending username, id and 2faenabled )

    console.log(`req.body.session id in /jwt-api/sign is ${req.body.sessionID}`); // null rn since DNE

    if (!user) {
        return res.status(400).json({ error: "User data is required" });
    }

    console.log(`Beginning JWT token creation for user:`, user);

    try {

        const sessionID = crypto.randomBytes(16).toString('hex')
        // sign a JWT using User
        const token = jwtModel.signJwtToken(user, sessionID);

        // If all validations pass, send a success response.
        return res.status(200).json({ message: "Token creation successful.", token: token });

    } catch (error) {
        console.error(`Error signing token ${username}: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//AT THE END
httpsServer.listen(PORT, () => {
    console.log(`Jwt server listening on port ${PORT}...`);
});