const axios = require('axios');
const https = require('https');
const crypto = require('crypto');

const serverBaseUrl = 'https://localhost:3000';

const getEncryptedData = async (noteTitle, noteText, noteCreatedDate, noteUpdatedDate, noteAccessedDate, userID, userHash) => {
    try {
        if (!plaintext || !userHash) {
            throw new Error('Plaintext and userHash are required.');
        }

        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(userHash, 'salt', 32);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        let encryptedData = cipher.update(noteText, 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        return {
            iv: iv.toString('hex'),
            encryptedData,
        };
    } catch (error) {
        throw error;
    }
};

describe('Data Encryption Model without HTTPS request', () => {
    it('should encrypt and decrypt data', async () => {
        const plaintext = 'This is a test message';
        const userHash = 'myStrongPassw0rd!!';

        // Encrypt the data
        const encryptedData = await getEncryptedData(plaintext, userHash);

        // Decrypt the data
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const encryptedText = encryptedData.encryptedData;
        const key = crypto.scryptSync(userHash, 'salt', 32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');

        expect(decryptedData).toBe(plaintext);
    });
});

describe('Data Encryption Controller - HTTPS POST request with SSL certificate verification disabled', () => {
    it('should successfully encrypt data via HTTPS POST with SSL certificate verification disabled', async () => {
        const plaintext = 'Welcome to the Machine';
        const userHash = 'P1nkFloyd';

        try {
            const agent = new https.Agent({
                rejectUnauthorized: false, //Because this is a self-signed certificate we are using
            });

            const response = await axios.post(`${serverBaseUrl}/ciphertext`, {
                plaintext,
                userHash,
            }, {
                httpsAgent: agent,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('iv');
            expect(response.data).toHaveProperty('encryptedData');

            const iv = Buffer.from(response.data.iv, 'hex');
            const encryptedText = response.data.encryptedData;
            const key = crypto.scryptSync(userHash, 'salt', 32);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
            decryptedData += decipher.final('utf8');

            expect(decryptedData).toBe(plaintext);
        } catch (error) {
            console.error('Request failed with error:', error);
            throw error;
        }
    });
});
