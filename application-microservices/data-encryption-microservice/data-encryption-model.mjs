
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

        console.log("secret key is", key.toString('hex'))

        const noteTitleCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedData = noteTitleCipher.update(noteTitle, 'utf8', 'hex');
        encryptedData += noteTitleCipher.final('hex');

        console.log("encrypted note title is", encryptedData)

        const noteTextCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedNoteData = noteTextCipher.update(noteText, 'utf8', 'hex');
        encryptedNoteData += noteTextCipher.final('hex')

        console.log(noteCreatedDate)


        //TODO: Talk to group about Dates? How will this affect the database? changing limits of varchar in SQL
        // database to account for much longer text strings because of encryption. Should userIDs also be encrypted?

        console.log("encrypted note data is", encryptedNoteData)




        console.log("encrypted data is", encryptedData)

        console.log("iv is ", iv.toString('hex'))
        return {
            iv: iv.toString('hex'),
            encryptedData,
            encryptedNoteData
        };



    } catch (error) {
        throw error;
    }
}


export { getEncryptedData };
