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

const getNoteTitle = async (noteTitleQuery) => {
    return new Promise((resolve, reject) => {
        db.pool.query(noteTitleQuery, function(error, iv, fields) {
            if (error) {
                reject(error);
            } else {
                if (iv[0] && iv[0].userNoteTitle) {
                    resolve(iv[0].userNoteTitle);
                } else {
                    reject(new Error('userNoteIV not found.'));
                }
            }
        });
    });
};

const getNoteText = async (noteTextQuery) => {
    return new Promise((resolve, reject) => {
        db.pool.query(noteTextQuery, function(error, iv, fields) {
            if (error) {
                reject(error);
            } else {
                if (iv[0] && iv[0].userNoteText) {
                    resolve(iv[0].userNoteText);
                } else {
                    reject(new Error('userNoteIV not found.'));
                }
            }
        });
    });
};

const getNoteCreated = async (noteCreatedQuery) => {
    return new Promise((resolve, reject) => {
        db.pool.query(noteCreatedQuery, function(error, iv, fields) {
            if (error) {
                reject(error);
            } else {
                if (iv[0] && iv[0].userNoteCreated) {
                    resolve(iv[0].userNoteCreated);
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

        //SQL queries
        const noteIVQuery = `SELECT userNoteIV FROM UserNotes where UserNoteID = '${userNoteIDBuffer}'`;
        const noteTitleQuery = `SELECT userNoteTitle FROM UserNotes where UserNoteID = '${userNoteIDBuffer}'`;
        const noteTextQuery = `SELECT userNoteText FROM UserNotes where UserNoteID = '${userNoteIDBuffer}'`;
        const userNoteCreatedQuery = `SELECT userNoteCreated FROM UserNotes where UserNoteID = '${userNoteIDBuffer}'`;
        const userNoteAccessedQuery = `SELECT userNoteCreated FROM UserNotes where UserNoteID = '${userNoteIDBuffer}'`;


        const userNoteIV = await getUserNoteIV(noteIVQuery);
        const userNoteTitle = await getNoteTitle(noteTitleQuery);
        const userNoteText = await getNoteText(noteTextQuery);
        const userNoteCreated = await getNoteCreated(userNoteCreatedQuery);

        const userNoteIVBuffer = Buffer.from(userNoteIV, 'hex');

        const userKey = crypto.scryptSync(userHash, 'salt', 32);

        console.log(userKey)

        const decipherTitle = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteIVBuffer);
        const decipherText = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteIVBuffer);
        const decipherCreated = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteIVBuffer);

        let decryptedNoteTitle = decipherTitle.update(userNoteTitle, 'hex', 'utf8');
        decryptedNoteTitle += decipherTitle.final('utf8');

        let decryptedNoteText = decipherText.update(userNoteText, 'hex', 'utf8');
        decryptedNoteText += decipherText.final('utf8');

        let decryptedNoteCreated = decipherCreated.update(userNoteCreated, 'hex', 'utf8');
        decryptedNoteCreated += decipherCreated.final('utf8')

        console.log('Decrypted Data:', decryptedNoteTitle);

        return {
            decryptedNoteTitle: decryptedNoteTitle,
            decryptedNoteText: decryptedNoteText,
            decryptedNoteCreated: decryptedNoteCreated
        };
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
};


export { getDecryptedData };
