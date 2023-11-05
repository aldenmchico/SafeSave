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

        console.log("iv is ", iv.toString('hex'));

        const encryptedData = {
            iv: iv.toString('hex'),
            encryptedTitleData,
            encryptedNoteData,
            noteCreatedDate,
            noteUpdatedDate,
            noteAccessedDate,
            userID
        };

        // Return the encrypted data to the client
        return encryptedData;

    } catch (error) {
        throw error;
    }
}

export { getEncryptedData };
