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

const getNoteUpdated = async (noteUpdatedQuery) => {
    return new Promise((resolve, reject) => {
        db.pool.query(noteUpdatedQuery, function(error, iv, fields) {
            if (error) {
                reject(error);
            } else {
                if (iv[0] && iv[0].userNoteUpdated) {
                    resolve(iv[0].userNoteUpdated);
                } else {
                    reject(new Error('userNoteIV not found.'));
                }
            }
        });
    });
};


const getNoteAccessed = async (noteAccessedQuery) => {
    return new Promise((resolve, reject) => {
        db.pool.query(noteAccessedQuery, function(error, iv, fields) {
            if (error) {
                reject(error);
            } else {
                if (iv[0] && iv[0].userNoteAccessed) {
                    resolve(iv[0].userNoteAccessed);
                } else {
                    reject(new Error('userNoteIV not found.'));
                }
            }
        });
    });
};

const getDecryptedData = async (options) => {

    const {
        userNoteID, userNoteTitle, userNoteText, userNoteCreated, userNoteUpdated, userNoteAccessed, userID, userNoteIV, userHash,
        userLoginItemID, userLoginItemWebsite, userLoginItemUsername, userLoginItemPassword,
        userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, IV
    } = options;


    if(userLoginItemID && userLoginItemWebsite && userLoginItemUsername && userLoginItemPassword && userLoginItemDateCreated
    && userLoginItemDateUpdated && userLoginItemDateAccessed && IV && userHash){
        try {
            const userLoginIVBuffer = Buffer.from(IV, 'hex');
            const userKey = crypto.scryptSync(userHash, 'salt', 32);

            const decipherWebsite = crypto.createDecipheriv('aes-256-cbc', userKey, userLoginIVBuffer)
            const decipherUsername = crypto.createDecipheriv('aes-256-cbc', userKey, userLoginIVBuffer)
            const decipherPassword = crypto.createDecipheriv('aes-256-cbc', userKey, userLoginIVBuffer)

            let decryptedWebsite = decipherWebsite.update(userLoginItemWebsite, 'hex', 'utf8');
            decryptedWebsite += decipherWebsite.final('utf8');

            let decryptedUsername = decipherUsername.update(userLoginItemUsername, 'hex', 'utf8');
            decryptedUsername += decipherUsername.final('utf8');

            let decryptedPassword = decipherPassword.update(userLoginItemPassword, 'hex', 'utf8');
            decryptedPassword += decipherPassword.final('utf8');

            return {
                userLoginItemID: userLoginItemID,
                userLoginItemWebsite: decryptedWebsite,
                userLoginItemUsername: decryptedUsername,
                userLoginItemPassword: decryptedPassword,
                userLoginItemDateCreated: userLoginItemDateCreated,
                userLoginItemDateUpdated: userLoginItemDateUpdated,
                userLoginItemDateAccessed: userLoginItemDateAccessed,
                userID: userID,
            };

        } catch (error){
            console.log("decryption failed: ", error)
            throw error;
        }
    }
    else
    {
        try {


            const userNoteIVBuffer = Buffer.from(userNoteIV, 'hex');

            const userKey = crypto.scryptSync(userHash, 'salt', 32);

            console.log(userKey)

            const decipherTitle = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteIVBuffer);
            const decipherText = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteIVBuffer);

            let decryptedNoteTitle = decipherTitle.update(userNoteTitle, 'hex', 'utf8');
            decryptedNoteTitle += decipherTitle.final('utf8');

            let decryptedNoteText = decipherText.update(userNoteText, 'hex', 'utf8');
            decryptedNoteText += decipherText.final('utf8');


            console.log('Decrypted Data:', decryptedNoteTitle);

            return {
                userNoteID: userNoteID,
                userNoteTitle: decryptedNoteTitle,
                userNoteText: decryptedNoteText,
                userNoteCreated: userNoteCreated,
                userNoteAccessed: userNoteAccessed,
                userNoteUpdated: userNoteUpdated,
                userID: userID
            };
        } catch (error) {
            console.error('Decryption failed:', error);
            throw error;
        }
    }
};


export { getDecryptedData };
