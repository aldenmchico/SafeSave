import 'dotenv/config';
import crypto from 'crypto';
import * as db from "./db-connector.cjs";

const getUserNoteIV = async (noteIVQuery) => {
    return new Promise((resolve, reject) => {
        db.pool.query(noteIVQuery, function(error, iv, fields) {
            if (error) {
                reject(error);
            } else {
                if (iv[0] && iv[0].userNoteIV) {
                    resolve(iv[0].userNoteIV);
                } else {
                    reject(new Error('userNoteIV not found.'));
                }
            }
        });
    });
};

const getDecryptedData = async (userNoteID, userHash) => {
    try {
        if (!userNoteID || !userHash ) {
            console.log("Checking to see if we received the userNote ID ", userNoteID, userHash)
            throw new Error('Note ID and user hash are required');
        }

        const userNoteIDBuffer = Buffer.from(userNoteID, 'utf8')

        const noteIVQuery = `SELECT userNoteIV FROM UserNotes where UserNoteID = '${userNoteIDBuffer}'`;

        const userNoteIV = await getUserNoteIV(noteIVQuery);

        const userNoteIVBuffer = Buffer.from(userNoteIV, 'hex');

        const userKey = crypto.scryptSync(userHash, 'salt', 32);

        console.log(userKey)

        // Convert the key and IV from hexadecimal to binary
        // const key = Buffer.from(keytext, 'hex');
        // const iv = Buffer.from(userNoteIV, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteIVBuffer);

        let decryptedData = decipher.update("1cdbe8073860187ae22b3fa49a5f23e8", 'hex', 'utf8');
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
