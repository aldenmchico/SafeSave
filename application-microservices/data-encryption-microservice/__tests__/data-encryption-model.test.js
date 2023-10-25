// const { getEncryptedData } = require('../data-encryption-model.mjs');

const crypto = require('crypto');

const axios = require('axios');


//Had to copy and paste this function from data encryption controller because I was having
//a hard time importing it for jest
const getEncryptedData = async (plaintext, userHash) => {
    try {
        // Ensure both plaintext and userHash are provided.
        if (!plaintext || !userHash) {
            throw new Error('Plaintext and userHash are required.');
        }

        const iv = crypto.randomBytes(16);

        const key = crypto.scryptSync(userHash, 'salt', 32);

        console.log("secret key is", key.toString('hex'))

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        console.log(cipher)
        let encryptedData = cipher.update(plaintext, 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        console.log("iv is ", iv.toString('hex'))
        return {
            iv: iv.toString('hex'),
            encryptedData,
        };

    } catch (error) {
        throw error;
    }
}


describe('Data Encryption Model without HTTP request', () => {
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

//Src: https://www.robinwieruch.de/axios-jest/

describe('Data Encryption Controller - HTTP request', () => {
    it('should successfully encrypt data via HTTP', async () => {
        const plaintext = 'Welcome to the Machine';
        const userHash = 'P1nkFloyd';
        const baseURL = 'http://127.0.0.1:3000'; // Define the base URL
        const path = `/ciphertext?plaintext=${encodeURIComponent(plaintext)}&userHash=${encodeURIComponent(userHash)}`;

        const url = `${baseURL}${path}`;

        try {
            const response = await axios.get(url, {
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
