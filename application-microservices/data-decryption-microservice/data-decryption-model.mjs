import 'dotenv/config';
import crypto from 'crypto';
import * as db from "./db-connector.mjs";
import fs from "fs";

async function decryptIV(encryptedData) {
    try {
        // Read the private key from the file
        const privKey = fs.readFileSync("private_ivkey.pem");

        // Decrypt the data using the private key
        const decryptedIV = crypto.privateDecrypt({ key: privKey, padding: crypto.constants.RSA_PKCS1_PADDING }, encryptedData);

        return decryptedIV;
    } catch (error) {
        console.error('Error during decryption:', error);
        throw error;
    }
}


const getDecryptedData = async (options) => {

    const {
        userNoteID, userNoteTitle, userNoteText, userNoteCreated, userNoteUpdated, userNoteAccessed, userID, userNoteIV, userHash,
        userLoginItemID, userLoginItemWebsite, userLoginItemUsername, userLoginItemPassword,
        userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, IV, userNoteTextIV, websiteIV, usernameIV, passwordIV,
        authTag, favorited, userSalt
    } = options;


    if(userLoginItemID && userLoginItemWebsite && userLoginItemUsername && userLoginItemPassword && userLoginItemDateCreated
    && userLoginItemDateUpdated && userLoginItemDateAccessed && websiteIV && userHash){
        try {

            const userWebsiteIVBuffer = Buffer.from(websiteIV, 'hex');
            const userKey = crypto.scryptSync(userHash, userSalt, 32);
            const userUsernameIVBuffer = Buffer.from(usernameIV, 'hex');
            const userPasswordIVBuffer = Buffer.from(passwordIV, 'hex');

            const decrypteduserWebsiteIVBuffer = await decryptIV(userWebsiteIVBuffer);
            const decipherWebsite = crypto.createDecipheriv('aes-256-cbc', userKey, decrypteduserWebsiteIVBuffer)

            const decrypteduserUsernameIVBuffer = await decryptIV(userUsernameIVBuffer);
            const decipherUsername = crypto.createDecipheriv('aes-256-cbc', userKey, decrypteduserUsernameIVBuffer)

            const decrypteduserPasswordIVBuffer = await decryptIV(userPasswordIVBuffer)
            const decipherPassword = crypto.createDecipheriv('aes-256-cbc', userKey, decrypteduserPasswordIVBuffer)

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
                    favorited: favorited
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
                favorited: favorited
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

            const decrypteduserNoteIVBuffer = await decryptIV(userNoteIVBuffer);

            const userKey = crypto.scryptSync(userHash, userSalt, 32);

            console.log(userKey)

            const decipherTitle = crypto.createDecipheriv('aes-256-cbc', userKey, decrypteduserNoteIVBuffer);

            const decrypteduserNoteTextIVBuffer = await decryptIV(userNoteTextIVBuffer)
            const decipherText = crypto.createDecipheriv('aes-256-cbc', userKey, decrypteduserNoteTextIVBuffer);

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
                    userID: userID,
                    favorited: favorited
                }
            }


            return {
                userNoteID: userNoteID,
                userNoteTitle: decryptedNoteTitle,
                userNoteText: decryptedNoteText,
                userNoteCreated: userNoteCreated,
                userNoteAccessed: userNoteAccessed,
                userNoteUpdated: userNoteUpdated,
                userID: userID,
                favorited: favorited
            };
        } catch (error) {
            console.error('Decryption failed:', error);
            throw error;
        }
    }
};


export { getDecryptedData };
