import 'dotenv/config';
import express from 'express';
import * as twoFACodeModel from './two-factor-authentication-code-model.mjs';
import qrcode from 'qrcode';
import { JsonDB, Config } from 'node-json-db';
import { v4 as uuidv4 } from 'uuid';



// Configure express server
const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json());

const db = new JsonDB(new Config('myDataBase', true, false, '/'));



// GET /authcode
// Request: Request body is a JSON object with the user's email
// Response: Success - Response contains JSON object with the authentication code sent via 2FA
// Status Code: 201
// Response: Failure - Request is invalid
// Body: JSON object Error
// Status Code: 400

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to 2FA auth code controller!' });
})

// register user 
app.post('/api/register', async (req, res) => {
    const id = uuidv4();

    try {
        const path = `/user/${id}`;
        const temp_secret = twoFACodeModel.generateSecret();
        await db.push(path, { id, temp_secret });
        res.json({ id, secret: temp_secret });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error generating secret" })
    }
})

app.post('/api/verify-token', async (req, res) => {
    const { token, userId } = req.body;

    try {
        const path = `/user/${userId}`;
        const user = await db.getData(path);

        console.log(user);

        const { temp_secret: secret } = user

        const verified = twoFACodeModel.verifyTOTP(token, secret)

        if (verified) {
            db.push(path, { id: userId, secret: user.temp_secret })
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

// combined both qr code generation and secret generation
app.get('/generate-mfa-qr-code', async (req, res) => {
    const user = req.user;

    // For security, we no longer show the QR code after is verified
    if (user.mfaEnabled) return res.status(404).end();

    if (!user.mfaSecret) {
        // generate unique secret for user
        // this secret will be used to check the verification code sent by user
        const secret = await twoFACodeModel.generateSecret(10);
        user.mfaSecret = secret // encrypt later in db
        setUser(user);
    }

    const issuer = 'SafeSave';
    const algorithm = 'SHA1';
    const digits = '6';
    const period = '30';
    const otpType = 'totp';
    const configUri = `otpauth://${otpType}/${issuer}:${user.username}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${user.mfaSecret}`;

    res.setHeader('Content-Type', 'image/png');

    otpauth: qrcode.toFileStream(res, configUri);
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});