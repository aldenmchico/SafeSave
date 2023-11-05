import 'dotenv/config';
import crypto from 'crypto';

const getDecryptedData = async (encryptedText, userHash, ivText) => {
    try {
        if (!encryptedText || !userHash || !ivText) {
            throw new Error('Encrypted text, key, and IV are required.');
        }

        const userKey = crypto.scryptSync(userHash, 'salt', 32);

        console.log(userKey)

        // Convert the key and IV from hexadecimal to binary
        // const key = Buffer.from(keytext, 'hex');
        const iv = Buffer.from(ivText, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', userKey, iv);

        let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');

        console.log('Decrypted Data:', decryptedData);

        return {
            decryptedData
        };
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
};


export { getDecryptedData };
