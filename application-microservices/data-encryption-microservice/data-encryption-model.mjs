import 'dotenv/config';
import crypto from 'crypto';

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
        password
    } = options;

    try {
        // Ensure both plaintext and userHash are provided.
        if (userHash && noteTitle && noteText && noteCreatedDate && noteUpdatedDate && noteAccessedDate && userID) {
            const iv = crypto.randomBytes(16);
            const key = crypto.scryptSync(userHash, 'salt', 32);

            const userNoteTextIV = crypto.randomBytes(16);

            const noteTitleCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedTitleData = noteTitleCipher.update(noteTitle, 'utf8', 'hex');
            encryptedTitleData += noteTitleCipher.final('hex');

            //Using a different IV... more secure.
            const noteTextCipher = crypto.createCipheriv('aes-256-cbc', key, userNoteTextIV);
            let encryptedNoteData = noteTextCipher.update(noteText, 'utf8', 'hex');
            encryptedNoteData += noteTextCipher.final('hex');



            const encryptedData = {
                iv: iv.toString('hex'),
                userNoteTextIV: userNoteTextIV.toString('hex'),
                encryptedTitleData,
                encryptedNoteData,
                userNoteCreated: noteCreatedDate,
                userNoteUpdated: noteUpdatedDate,
                userNoteAccessed: noteAccessedDate,
                userID,
            };

            // Return the encrypted data to the client
            return encryptedData;
        }

        else if(website && username && password && userHash){

            const iv = crypto.randomBytes(16);
            const key = crypto.scryptSync(userHash, 'salt', 32);

            const websiteCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedWebsiteData = websiteCipher.update(website, 'utf8', 'hex');
            encryptedWebsiteData += websiteCipher.final('hex');

            const usernameCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedUsernameData = usernameCipher.update(username, 'utf8', 'hex');
            encryptedUsernameData += usernameCipher.final('hex');

            const passwordCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedPasswordData = passwordCipher.update(password, 'utf8', 'hex');
            encryptedPasswordData += passwordCipher.final('hex');

            const encryptedData = {
                iv: iv.toString('hex'),
                encryptedWebsiteData,
                encryptedUsernameData,
                encryptedPasswordData
            }
            return encryptedData

        }



    } catch (error) {
        throw error;
    }
}

export { getEncryptedData };
