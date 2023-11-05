import 'dotenv/config';
import express from 'express';
import * as dataEncryptionModel from './data-encryption-model.mjs';
import path from 'path';

// Import your database connector
import db from './db-connector.cjs';

// HTTPS
import https from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKeyPath = path.resolve(__dirname, 'key.pem');
const certificatePath = path.resolve(__dirname, 'cert.pem');

let privateKey;
let certificate;

try {
    privateKey = readFileSync(privateKeyPath, 'utf8');
    certificate = readFileSync(certificatePath, 'utf8');
} catch (error) {
    console.error('Error reading SSL certificate files:', error);
    process.exit(1);
}

const passphrase = process.env.SSL_PASSPHRASE;
const creds = { key: privateKey, cert: certificate, passphrase: passphrase };

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static('public'));

const httpsServer = https.createServer(creds, app);

// POST /ciphertext
app.post('/ciphertext', async (req, res) => {
    const {
        noteTitle,
        noteText,
        noteCreatedDate,
        noteUpdatedDate,
        noteAccessedDate,
        userID,
        userHash,
    } = req.body;

    try {

        const encryptedData = await dataEncryptionModel.getEncryptedData(
            noteTitle,
            noteText,
            noteCreatedDate,
            noteUpdatedDate,
            noteAccessedDate,
            userID,
            userHash,
        );


        const query = `
            INSERT INTO UserNotes
            (userNoteTitle, userNoteText, userNoteCreated, userNoteUpdated, userNoteAccessed, userID, userNoteIV)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.pool.query(query, [
            encryptedData.encryptedTitleData,
            encryptedData.encryptedNoteData,
            encryptedData.noteCreatedDate,
            encryptedData.noteUpdatedDate,
            encryptedData.noteAccessedDate,
            encryptedData.userID,
            encryptedData.iv
        ], (error, result) => {
            if (error) {
                res.status(400).json({ error: error.message });
            } else {
                // If the insertion is successful, you can serve your HTML file
                const htmlFilePath = 'public/index.html';
                const normalizedPath = path.normalize(htmlFilePath);
                res.sendFile(normalizedPath);
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

httpsServer.listen(PORT, () => {
    console.log(`Encryption server listening on port ${PORT}...`);
});
