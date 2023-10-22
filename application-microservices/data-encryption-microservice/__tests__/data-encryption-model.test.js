import crypto from 'crypto';
import * as dataEncryptionModel from '../data-encryption-model.mjs';

describe('Data Encryption Model', () => {
    it('should encrypt and decrypt data', async () => {
        const plaintext = 'This is a test message';
        const userHash = 'aStrongPasswordHash';

        // Encrypt the data
        const encryptedData = await getEncryptedData(plaintext, userHash);

        // Decrypt the data
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const encryptedText = encryptedData.encryptedData;
        const key = crypto.scryptSync(userHash, 'salt', 32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');

        expect(decryptedData).toBe(plaintext);
    });
});
