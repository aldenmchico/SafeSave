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
        userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, IV, userNoteTextIV, websiteIV, usernameIV, passwordIV,
        authTag
    } = options;


    if(userLoginItemID && userLoginItemWebsite && userLoginItemUsername && userLoginItemPassword && userLoginItemDateCreated
    && userLoginItemDateUpdated && userLoginItemDateAccessed && websiteIV && userHash){
        try {
            const userWebsiteIVBuffer = Buffer.from(websiteIV, 'hex');
            const userKey = crypto.scryptSync(userHash, 'salt', 32);
            const userUsernameIVBuffer = Buffer.from(usernameIV, 'hex');
            const userPasswordIVBuffer = Buffer.from(passwordIV, 'hex');


            const decipherWebsite = crypto.createDecipheriv('aes-256-cbc', userKey, userWebsiteIVBuffer)
            const decipherUsername = crypto.createDecipheriv('aes-256-cbc', userKey, userUsernameIVBuffer)
            const decipherPassword = crypto.createDecipheriv('aes-256-cbc', userKey, userPasswordIVBuffer)

            let decryptedWebsite = decipherWebsite.update(userLoginItemWebsite, 'hex', 'utf8');
            decryptedWebsite += decipherWebsite.final('utf8');

            let decryptedUsername = decipherUsername.update(userLoginItemUsername, 'hex', 'utf8');
            decryptedUsername += decipherUsername.final('utf8');

            let decryptedPassword = decipherPassword.update(userLoginItemPassword, 'hex', 'utf8');
            decryptedPassword += decipherPassword.final('utf8');

            const hmac = crypto.createHmac('sha256', userKey);
            hmac.update(decryptedWebsite + decryptedUsername + decryptedPassword );
            const reconstructedAuthTag = hmac.digest('hex');

            if(authTag !== reconstructedAuthTag){
                console.error("Something fishy is going on!");
                return {
                    userLoginItemID: userLoginItemID,
                    userLoginItemWebsite: "DATA COMPROMISED!!!!",
                    userLoginItemUsername: "DATA COMPROMISED!!!!",
                    userLoginItemPassword: "DATA COMPROMISED!!!!",
                    userLoginItemDateCreated: userLoginItemDateCreated,
                    userLoginItemDateUpdated: userLoginItemDateUpdated,
                    userLoginItemDateAccessed: userLoginItemDateAccessed,
                    userID: userID,
                }
            }


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
    else if(userNoteTitle && userNoteText)
    {
        try {


            const userNoteIVBuffer = Buffer.from(userNoteIV, 'hex');
            const userNoteTextIVBuffer = Buffer.from(userNoteTextIV, 'hex');

            const userKey = crypto.scryptSync(userHash, 'salt', 32);

            console.log(userKey)

            const decipherTitle = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteIVBuffer);
            const decipherText = crypto.createDecipheriv('aes-256-cbc', userKey, userNoteTextIVBuffer);

            let decryptedNoteTitle = decipherTitle.update(userNoteTitle, 'hex', 'utf8');
            decryptedNoteTitle += decipherTitle.final('utf8');

            let decryptedNoteText = decipherText.update(userNoteText, 'hex', 'utf8');
            decryptedNoteText += decipherText.final('utf8');

            const hmac = crypto.createHmac('sha256', userKey);
            hmac.update(decryptedNoteText + decryptedNoteTitle);
            const reconstructedAuthTag = hmac.digest('hex');

            if(reconstructedAuthTag !== authTag){
                console.log("Something fishy is going on!")
                return {
                    userNoteID: userNoteID,
                    userNoteTitle: "DATA POTENTIALLY COMPROMISED",
                    userNoteText: "DATA POTENTIALLY COMPROMISED",
                    userNoteCreated: userNoteCreated,
                    userNoteAccessed: userNoteAccessed,
                    userNoteUpdated: userNoteUpdated,
                    userID: userID
                }
            }


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
