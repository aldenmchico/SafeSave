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

//Added local laptop IP for testing from different computers in my network
//CORS is VERY picky about the origin IP; app.use(cors()) is not strict enough when dealing with any sort of cookie
//which is the reason why localhost worked, and 127.0.0.1 didn't and vice-versa.
//allowed origins will EVENTUALLY have our domain name at port 443 once we host!
const allowedOrigins = ['https://localhost:3000', 'https://127.0.0.1:3000', 'https://192.168.88.79:3000']

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

    if (!user) {
        return res.status(400).json({ error: "User data is required" });
    }

    console.log(`Beginning JWT token creation for user:`, user);

    try {
        // sign a JWT using User
        const token = jwtModel.signJwtToken(user);

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