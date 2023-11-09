import 'dotenv/config';
import express from 'express';
import * as twoFACodeModel from './two-factor-authentication-code-model.mjs';
import qrcode from 'qrcode';
import cors from 'cors';

// Configure express server
const PORT = process.env.PORT;
const app = express();


app.use(express.json());

// Enable All CORS Requests
app.use(cors());

app.get('/api', (req, res) => {
    /*
    Dummy /api endpoint 
    */
    res.status(200).json({ message: 'Welcome to 2FA controller!' });
})

app.post('/api/2fa-registration', cors(), async (req, res) => {
    /*
    generates and stores a temporary secret given a userId
    */

    // TODO: pull user from sql db using some form of persistent JWT token?
    // replace userId below with user from db  

    // temporary solution to emulate a user
    const { enableTwoFactor, userId } = req.body;

    console.log(`enableTwoFactor is: ${enableTwoFactor}`);

    // If the request is to disable 2FA
    if (!enableTwoFactor) {
        try {
            const twoFADisabled = twoFACodeModel.disableTwoFactor(userId);
            if (!twoFADisabled) {
                return res.status(400).json({ message: `Something went wrong trying to disable 2FA for userId ${userId}` });
            }
            return res.status(200).json({ message: `2FA was disabled for userId ${userId}` });
        } catch (error) {
            return res.status(500).json({ message: "Error in process of disabling 2FA." });
        }
    }

    try {
        const temp_secret = twoFACodeModel.generateAndStoreTempSecretToken(userId);
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

app.post('/api/verify-2fa-setup-token', async (req, res) => {
    /*
    Verifies temporary secret token.

    On success, overwrites 'temp_secret' --> 'secret'.
    */

    // TODO: pull user from sql db using some form of persistent JWT token?
    // replace userId below with user from db  
    const { userId, token, secret } = req.body;

    try {

        // verify that token from authenticator is same as token generated using secret -  make temporary token, permanent for user
        const verified = twoFACodeModel.verifyTemporaryTOTP(userId, token, secret)

        if (verified) {
            return res.status(200).json({ verified: true });
        }
        return res.status(200).json({ verified: false });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error verifying token" })
    }
})

app.post('/api/generate-mfa-qr-code', async (req, res) => {
    /*
    Generates QR code for 2FA setup so user doesn't have to use put in secret into authenticator. 

    Assumes mfaEnabled variable is set and both secret and username are generated.
    Checks if 2FA already set up.
    
    TODO??: if not, maybe generates a QR code that the user scans with their authenticator app.  
    */

    // username is from the authenticator - NOT user's username
    const { mfaEnabled, mfaSecret, username } = req.body;

    // For security, we no longer show the QR code if already verified
    // if (mfaEnabled) return res.status(404).json({ message: "mfa is already enabled " });

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
    return qrcode.toFileStream(res, configUri);
});

app.post('/api/verify-2fa-login-token', (req, res) => {
    /*  
    Verifies the token received when user tries logging into app.
    Assumes 2FA is already set up and user has an account setup.
    */

    // TODO: pull user from sql db using some form of persistent JWT token?
    // replace userId below with user from db  
    const { userId, token, secret, user2FAEnabled } = req.body;

    // check if 2FA is even enabled
    if (!user2FAEnabled) {
        return res.status(400).json({ message: "2FA is not enabled." });
    }

    // Check for required fields
    if (!userId || !token || !secret) {
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



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});


/* 

Eugene's Notes: (Will remove later) 

// import { v4 as uuidv4 } from 'uuid';
  // const id = uuidv4();

*/