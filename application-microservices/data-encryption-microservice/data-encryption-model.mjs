
import 'dotenv/config';
import crypto from 'crypto';



// Encrypt data using the password hash and plaintext data
const getEncryptedData = async (noteTitle, noteText, noteCreatedDate, noteUpdatedDate, noteAccessedDate, userID, userHash) => {
    try {
        // Ensure both plaintext and userHash are provided.
        if (!userHash) {
            throw new Error(' userHash is required.');
        }

        const iv = crypto.randomBytes(16);

        const key = crypto.scryptSync(userHash, 'salt', 32);

        console.log("secret key is", key.toString('hex'))

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        console.log(cipher)
        let encryptedData = cipher.update(noteTitle, 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        console.log("encrypted data is", encryptedData)

        console.log("iv is ", iv.toString('hex'))
        return {
            iv: iv.toString('hex'),
            encryptedData,
        };



    } catch (error) {
        throw error;
    }
}


export { getEncryptedData };
