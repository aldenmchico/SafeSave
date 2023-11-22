// Import dependencies.
import 'dotenv/config';
import crypto from 'crypto';
import base32 from 'hi-base32';

import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false
});

// generate temp secret key for step 1 of 2FA 
const generateAndStoreTempSecretToken = async (userId, length = 20) => {

    try {

        const randomBuffer = crypto.randomBytes(length);
        const cleanedSecret = base32.encode(randomBuffer).replace(/=/g, '');

        // Prepare data for the PATCH request
        const patchData = {
            userTempSecret: cleanedSecret,
            userID: userId,
            user2FAEnabled: 1
        };

        // Send PATCH request to update user's temp secret
        const response = await fetch(`https://localhost:3001/users/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`User updated: `, data);
        return data;
    } catch (error) {
        console.error('Error in generating and storing secret: ', error.message);
    }
}

const doDynamicTruncation = (hmacValue) => {
    const offset = hmacValue[hmacValue.length - 1] & 0xf;

    return (
        ((hmacValue[offset] & 0x7f) << 24) |
        ((hmacValue[offset + 1] & 0xff) << 16) |
        ((hmacValue[offset + 2] & 0xff) << 8) |
        (hmacValue[offset + 3] & 0xff)
    );
}

const generateHOTP = (secret, counter) => {

    console.log("Attempting to decode:", secret);

    // decode secret
    const decodedSecret = base32.decode.asBytes(secret);

    // create buffer from counter
    const buffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
        buffer[7 - i] = counter & 0xff;
        counter = counter >> 8;
    }

    // Step 1) Generate HMAC value
    const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret));
    hmac.update(buffer);
    const hmacResult = hmac.digest();   // 20-byte string which is an HMAC-SHA-1 value.

    // Step 2) Dynamic Truncation
    const code = doDynamicTruncation(hmacResult);

    //   Step 3 — Compute the HOTP value
    const hotp = code % (10 ** 6);

    return hotp
}
const generateTOTP = (secret, window = 0) => {
    const counter = Math.floor(Date.now() / 30000);
    return generateHOTP(secret, counter + window);
}

// token is the TOTP from Google Authenticator
const verifyTemporaryTOTP = async (userId, token, secret, window = 1) => {

    try {

        if (Math.abs(+window) > 10) {
            console.error('Window size is too large');
            return false;
        }

        for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
            const totp = generateTOTP(secret, errorWindow);

            console.log(`token is ${token}`)
            console.log(`totp is ${totp}`)
            // token matches totp from auth
            if (token == totp) {

                // Prepare data for the PATCH request
                const patchData = {
                    userSecret: secret,
                    userID: userId,
                    userTempSecret: null,
                };

                // Send PATCH request to update user's primary secret field
                const response = await fetch(`https://localhost:3001/users/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(patchData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(`User updated: `, data);
                return true; // Return true only if the token matches
            }
        }

    } catch (error) {
        console.error('Error in verifying temporary secret: ', error.message);
        return false; // Return false if there is an exception
    }


    return false; // Return false if the token never matches
}

// token is the TOTP from Google Authenticator
const verifyAuthenticatedTOTP = (token, secret, window = 1) => {

    if (Math.abs(+window) > 10) {
        console.error('Window size is too large');
        return false;
    }

    for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
        const totp = generateTOTP(secret, errorWindow);
        console.log('verifyAuthenticatedTOTP): ');
        console.log(`token is ${token}`)
        console.log(`totp is ${totp}`)
        if (token === totp) {
            return true;
        }
    }
    return false;
}

const disableTwoFactor = async (userId) => {

    // Prepare data for the PATCH request
    const patchData = {
        userID: userId,
        user2FAEnabled: 0,
        userSecret: null,
        userTempSecret: null
    };
    try {
        // Send PATCH request to update user's primary secret field
        const response = await fetch(`https://localhost:3001/users/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchData),
            agent: agent
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`User information updated - 2FA disabled: `, data);
        return data;
    } catch (error) {
        console.error('Error in disabling 2FA in model: ', error.message);
    }
};

const checkIfUserHas2FAEnabled = async (username) => {
    try {
        const response = await fetch(`https://localhost:3001/users/byUsername/${username}`)
        if (!response.ok) {
            throw new Error('Network response was not ok in two factor model file in checkIfUserHas2FAEnabled(). ');
        }
        const data = await response.json();
        console.log(`user data found in checkIfUserHas2FAEnabled: `, data);

        const twoFactor = data[0].user2FAEnabled
        const secret = data[0].userSecret
        if (!twoFactor) return false // if 2FA disabled 

        return true
    } catch (error) {
        console.log('There was a problem with the fetch operation in checkIfUserHas2FAEnabled:', error.message);
    }
}

const checkIfUserHas2FAEnabledAndNoSecret = async (username) => {

    console.log("username passed to 2fa is", username)
    try {



        const response = await fetch(`https://localhost:3001/users/byUsername/${username}`)
        if (!response.ok) {
            throw new Error('Network response was not ok in twoFactorAuthenticationModel: checkIfUserHas2FAEnabledAndNoSecret');
        }
        const data = await response.json();
        console.log(`user data found in checkIfUserHas2FAEnabledAndNoSecret(): `, data);

        const twoFactor = data[0].user2FAEnabled
        const secret = data[0].userSecret
        if (!twoFactor || secret) return false // if FA disabled or official Secret already exists 
        return true
    } catch (error) {
        console.log('There was a problem with the fetch operation in checkIfUserHas2FAEnabledAndNoSecret:', error.message);
    }
}

const checkIfUserHas2FAAndSecretEstablished = async (username) => {
    try {
        const response = await fetch(`https://localhost:3001/users/byUsername/${username}`)
        if (!response.ok) {
            throw new Error('Network response was not ok in twoFactorAuthenticationModel: checkIfUserHas2FAAndSecretEstablished');
        }
        const data = await response.json();
        const twoFactor = data[0].user2FAEnabled
        const secret = data[0].userSecret
        if (twoFactor && secret) return true; // if 2FA and official Secret already exists 
        return false;
    } catch (error) {
        console.log('There was a problem with the fetch operation in checkIfUserHas2FAAndSecretEstablished:', error.message);
    }
}



const returnUserDataByUsername = async (username) => {
    try {
        const response = await fetch(`https://localhost:3001/users/byUsername/${username}`)
        if (!response.ok) {
            throw new Error('Network response was not ok in twoFactorAuthenticationModel: returnUserDataByUsername');
        }
        const data = await response.json();
        console.log(`user data found in returnUserDataByUsername(): `, data);
        if (!data) return null
        return data
    } catch (error) {
        console.log('There was a problem with the fetch operation in returnUserDataByUsername:', error.message);
    }
}

// Exports for genre-microservice-controller
export {
    generateAndStoreTempSecretToken, verifyTemporaryTOTP,
    verifyAuthenticatedTOTP, disableTwoFactor,
    checkIfUserHas2FAEnabled, checkIfUserHas2FAEnabledAndNoSecret, returnUserDataByUsername, checkIfUserHas2FAAndSecretEstablished
};
