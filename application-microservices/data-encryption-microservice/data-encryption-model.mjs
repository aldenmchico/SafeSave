import 'dotenv/config';
import crypto from 'crypto';

// Encrypt data using the password hash and plaintext data
const getEncryptedData = async (noteTitle, noteText, noteCreatedDate, noteUpdatedDate, noteAccessedDate, userID, userHash) => {
    try {
        // Ensure both plaintext and userHash are provided.
        if (!userHash || !noteTitle || !noteText || !noteCreatedDate || !noteUpdatedDate || !noteAccessedDate || !userID) {
            console.log("All HTML fields are required");
            throw new Error('All fields are required.');
        }

        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(userHash, 'salt', 32);

        const noteTitleCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedTitleData = noteTitleCipher.update(noteTitle, 'utf8', 'hex');
        encryptedTitleData += noteTitleCipher.final('hex');

        const noteTextCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedNoteData = noteTextCipher.update(noteText, 'utf8', 'hex');
        encryptedNoteData += noteTextCipher.final('hex');

        const noteCreatedDateCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptednoteCreatedDate = noteCreatedDateCipher.update(noteCreatedDate, 'utf8', 'hex');
        encryptednoteCreatedDate += noteCreatedDateCipher.final('hex');

        const noteUpdatedDateCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptednoteUpdatedDate = noteUpdatedDateCipher.update(noteUpdatedDate, 'utf8', 'hex');
        encryptednoteUpdatedDate += noteUpdatedDateCipher.final('hex');

        const noteAccessedDateCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptednoteAccessedDate = noteAccessedDateCipher.update(noteAccessedDate, 'utf8', 'hex');
        encryptednoteAccessedDate += noteAccessedDateCipher.final('hex');



        console.log("iv is ", iv.toString('hex'));
        console.log("key is", key.toString('hex'))
        console.log("encrypted note title is", encryptedTitleData)
        console.log("encrypted note data is", encryptedNoteData)
        console.log("encrypted created date", encryptednoteCreatedDate)
        console.log("encrypted note updated date", encryptednoteUpdatedDate)
        console.log("encrypted note accessed date", encryptednoteAccessedDate)



        const encryptedData = {
            iv: iv.toString('hex'),
            encryptedTitleData,
            encryptedNoteData,
            encryptednoteCreatedDate,
            encryptednoteUpdatedDate,
            encryptednoteAccessedDate,
            userID,
            key
        };

        // Return the encrypted data to the client
        return encryptedData;

    } catch (error) {
        throw error;
    }
}

export { getEncryptedData };
