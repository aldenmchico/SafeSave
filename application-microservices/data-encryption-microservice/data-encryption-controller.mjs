import 'dotenv/config';
import express from 'express';
import * as dataEncryptionModel from './data-encryption-model.mjs';
import path from 'path';


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

const PORT = process.env.PORT;
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

        if (req.body.noteTitle && req.body.noteText && req.body.noteCreatedDate && req.body.noteUpdatedDate && req.body.noteAccessedDate
        && req.body.userID) {
            const encryptedData = await dataEncryptionModel.getEncryptedData(
                {
                    noteTitle: noteTitle,
                    noteText: noteText,
                    noteCreatedDate: noteCreatedDate,
                    noteUpdatedDate: noteUpdatedDate,
                    noteAccessedDate: noteAccessedDate,
                    userID: userID,
                    userHash: userHash,
                }
            );

            const response = {
                encryptedTitleData: encryptedData.encryptedTitleData,
                encryptedNoteData: encryptedData.encryptedNoteData,
                encryptednoteCreatedDate: encryptedData.noteCreatedDate,
                encryptednoteAccessedDate: encryptedData.noteAccessedDate,
                encryptednoteUpdatedDate: encryptedData.noteUpdatedDate,
                iv: encryptedData.iv,
                userNoteTextIV: encryptedData.userNoteTextIV,
                authTag: encryptedData.authTag
            };
            res.status(201).json(response);
        }

        else if (req.body.userLoginWebsite && req.body.userLoginUsername && req.body.userLoginPassword){

            const encryptedData = await dataEncryptionModel.getEncryptedData(
                {
                    website: req.body.userLoginWebsite,
                    username: req.body.userLoginUsername,
                    password: req.body.userLoginPassword,
                    userHash: req.body.userHash
                }
            );

            const response = {
                encryptedWebsite: encryptedData.encryptedWebsiteData,
                encryptedUsername: encryptedData.encryptedUsernameData,
                encryptedPassword: encryptedData.encryptedPasswordData,
                websiteIV: encryptedData.websiteIV,
                usernameIV: encryptedData.usernameIV,
                passwordIV: encryptedData.passwordIV,
                authTag: encryptedData.authTag
            };

            res.status(201).json(response);
        }
        else{
            console.log("Invalid query");
            res.status(400).json({error: error.message});
        }



    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

httpsServer.listen(PORT, () => {
    console.log(`Encryption server listening on port ${PORT}...`);
});
