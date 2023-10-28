import 'dotenv/config';
import express from 'express';
import * as twoFACodeModel from './two-factor-authentication-code-model.mjs';
import qrcode from 'qrcode';
import { JsonDB, Config } from 'node-json-db';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../../database/db-connector.mjs';


// Configure express server
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
const db = new JsonDB(new Config('myDataBase', true, false, '/'));

app.get('/api', (req, res) => {
    /*
    Dummy /api endpoint 
    */
    res.json({ message: 'Welcome to 2FA controller!' });
})

app.post('/api/register', async (req, res) => {
    /*
    Testing purposes.
    Registers a user, assigns id and generates a temporary secret with id.
    */
    const id = uuidv4();
    try {

        // create unique id, assign to user and generate secret 
        const path = `/user/${id}`;
        const temp_secret = twoFACodeModel.generateSecret();
        await db.push(path, { id, temp_secret });
        res.json({ id, secret: temp_secret });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error generating secret" })
    }
})

app.post('/api/verify-2fa-setup-token', async (req, res) => {
    /*
    Verifies temporary secret token.

    On success, overwrites 'temp_secret' --> 'secret'.
    */
    const { token, username } = req.body;

    try {

        // pull user from db 
        const path = `/user/${username}`;
        const user = await db.getData(path);
        console.log(`user's data is: ${user}`);


        const { temp_secret: secret } = user

        // verify that token from authenticator is same as token generated using secret
        const verified = twoFACodeModel.verifyTOTP(token, secret)

        // make temporary token, permanent for user
        if (verified) {
            db.push(path, { id: username, secret: user.temp_secret });
            res.json({ verified: true });
        }
        else {
            res.json({ verified: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error verifying token" })
    }
})

app.post('/api/generate-mfa-qr-code', async (req, res) => {
    /*
    Generates QR code for 2FA setup.

    Assumes mfaEnabled variable is set and both secret and username are generated.
    Checks if 2FA already set up.
    TODO??: if not, maybe generates a QR code that the user scans with their authenticator app.  

    */
    const { mfaEnabled, mfaSecret, username } = req.body;

    // For security, we no longer show the QR code if already verified
    if (mfaEnabled) return res.status(404).end();

    // Ensure that the mfaSecret is provided
    if (!mfaSecret) {
        return res.status(400).json({ message: "No MFA secret provided" });
    }

    // qr code config 
    const issuer = 'SafeSave';
    const algorithm = 'SHA1';
    const digits = '6';
    const period = '30';
    const otpType = 'totp';
    const configUri = `otpauth://${otpType}/${issuer}:${username}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${mfaSecret}`;

    // generate qr code
    res.setHeader('Content-Type', 'image/png');
    qrcode.toFileStream(res, configUri);
});

app.post('/api/verify-2fa-login-token', async (req, res) => {
    /*  
    Verifies the token received when user tries logging into app.

    Assumes 2FA is already set up.
    */

    const { username, token } = req.body;

    // Check for required fields
    if (!username || !token) {
        return res.status(400).json({ message: "Username and token are required." });
    }

    try {
        // Fetch the user's data from the database
        const path = `/user/${username}`;
        const user = await db.getData(path);


        console.log(user)
        console.log(user.secret)
        const { secret } = user

        console.log(secret)



        if (!user || !secret) {
            return res.status(404).json({ message: "User not found or 2FA not set up." });
        }

        // Verify the provided token against the user's stored secret
        const isValid = twoFACodeModel.verifyTOTP(token, secret);

        if (isValid) {
            // If the 2FA verification is successful, respond accordingly
            // Here you might also want to establish a session or generate an access token
            return res.json({ verified: true });
        } else {
            return res.status(401).json({ message: "Invalid 2FA token." });
        }
    } catch (error) {
        console.error("Error verifying 2FA:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});



app.listen(PORT, () => {

    pool.query(`SELECT * FROM Users`, (err, result, filled) => {
        if (err) return console.log(err);

        return console.log(result);
    })

    console.log(`Server listening on port ${PORT}...`);
});