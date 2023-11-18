import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';


async function encryptIV(data) {
    try {
        const pubKey = fs.readFileSync("public_ivkey.pem");

        const encryptedData = crypto.publicEncrypt({ key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data));


        return encryptedData;
    } catch (error) {
        console.error('Error during encryption:', error);
        throw error;
    }
}

// Encrypt data using the password hash and plaintext data
const getEncryptedData = async (options) => {
    const {
        noteTitle,
        noteText,
        noteCreatedDate,
        noteUpdatedDate,
        noteAccessedDate,
        userID,
        userHash,
        website,
        username,
        password,
        userSalt
    } = options;

    try {
        // Ensure both plaintext and userHash are provided.
        if (userHash && noteTitle && noteText && noteCreatedDate && noteUpdatedDate && noteAccessedDate && userID) {
            const iv = crypto.randomBytes(16);
            const encryptediv = await encryptIV(iv)

            const key = crypto.scryptSync(userHash, userSalt, 32);

            const userNoteTextIV = crypto.randomBytes(16);
            const encrypteduserNoteTextIV = await encryptIV(userNoteTextIV);

            const noteTitleCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedTitleData = noteTitleCipher.update(noteTitle, 'utf8', 'hex');
            encryptedTitleData += noteTitleCipher.final('hex');


            //Using a different IV... more secure.
            const noteTextCipher = crypto.createCipheriv('aes-256-cbc', key, userNoteTextIV);
            let encryptedNoteData = noteTextCipher.update(noteText, 'utf8', 'hex');
            encryptedNoteData += noteTextCipher.final('hex');

            const hmac = crypto.createHmac('sha256', key);
            hmac.update(noteText + noteTitle);
            const authTag = hmac.digest('hex');

            console.log("authtag is", authTag);


            const encryptedData = {
                iv: encryptediv.toString('hex'),
                userNoteTextIV: encrypteduserNoteTextIV.toString('hex'),
                encryptedTitleData,
                encryptedNoteData,
                userNoteCreated: noteCreatedDate,
                userNoteUpdated: noteUpdatedDate,
                userNoteAccessed: noteAccessedDate,
                userID,
                authTag: authTag
            };


            return encryptedData;
        }

        else if(website && username && password && userHash){

            const websiteIV = crypto.randomBytes(16);
            const key = crypto.scryptSync(userHash, userSalt, 32);

            const encryptedwebsiteIV = await encryptIV(websiteIV)

            const websiteCipher = crypto.createCipheriv('aes-256-cbc', key, websiteIV);
            let encryptedWebsiteData = websiteCipher.update(website, 'utf8', 'hex');
            encryptedWebsiteData += websiteCipher.final('hex');

            const userNameIV = crypto.randomBytes(16);
            const encrypteduserNameIV = await encryptIV(userNameIV)

            const usernameCipher = crypto.createCipheriv('aes-256-cbc', key, userNameIV);
            let encryptedUsernameData = usernameCipher.update(username, 'utf8', 'hex');
            encryptedUsernameData += usernameCipher.final('hex');

            const passwordIV = crypto.randomBytes(16);
            const passwordCipher = crypto.createCipheriv('aes-256-cbc', key, passwordIV);
            let encryptedPasswordData = passwordCipher.update(password, 'utf8', 'hex');
            encryptedPasswordData += passwordCipher.final('hex');

            const encryptedpasswordIV = await encryptIV(passwordIV);

            const hmac = crypto.createHmac('sha256', key);
            hmac.update(website + username + password);
            const authTag = hmac.digest('hex');

            const encryptedData = {
                websiteIV: encryptedwebsiteIV.toString('hex'),
                usernameIV: encrypteduserNameIV.toString("hex"),
                passwordIV: encryptedpasswordIV.toString('hex'),
                encryptedWebsiteData,
                encryptedUsernameData,
                encryptedPasswordData,
                authTag: authTag
            }
            return encryptedData

        }



    } catch (error) {
        throw error;
    }
}

export { getEncryptedData };
