import 'dotenv/config';
import crypto from 'crypto';

const getDecryptedData = async (encryptedText, keytext, ivText) => {
    try {
        if (!encryptedText || !keytext || !ivText) {
            throw new Error('Encrypted text, key, and IV are required.');
        }

        // Convert the key and IV from hexadecimal to binary
        const key = Buffer.from(keytext, 'hex');
        const iv = Buffer.from(ivText, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

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
