import 'dotenv/config';
import crypto from 'crypto';

// UPDATE: Data decryption needs to accept a JSON object containing row data.
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

        // UPDATE: Return should send back a JSON object of decrypted row data without the IVs that were provided in the input
        return {
            decryptedData
        };
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
};


export { getDecryptedData };
