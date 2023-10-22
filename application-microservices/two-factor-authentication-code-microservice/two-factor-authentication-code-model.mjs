// Import dependencies.
import 'dotenv/config';
import crypto from 'crypto';
import base32 from 'hi-base32';

// generate secret key for step 1 of 2FA 
const generateSecret = (length = 20) => {
    const randomBuffer = crypto.randomBytes(length);
    return base32.encode(randomBuffer).replace(/=/g, '');
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
const verifyTOTP = (token, secret, window = 1) => {
    if (Math.abs(+window) > 10) {
        console.error('Window size is too large');
        return false;
    }

    for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
        const totp = generateTOTP(secret, errorWindow);
        if (token == totp) {
            return true;
        }
    }
    return false;
}




// Exports for genre-microservice-controller
export { generateSecret, verifyTOTP };
