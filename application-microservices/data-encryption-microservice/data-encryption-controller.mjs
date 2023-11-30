import 'dotenv/config';
import express from 'express';
import * as dataEncryptionModel from './data-encryption-model.mjs';
import path from 'path';

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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const creds = { key: privateKey, cert: certificate};

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
        userSalt
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
                    userSalt: userSalt
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
            return res.status(201).json(response);
        }

        else if (req.body.userLoginWebsite && req.body.userLoginUsername && req.body.userLoginPassword){

            const encryptedData = await dataEncryptionModel.getEncryptedData(
                {
                    website: req.body.userLoginWebsite,
                    username: req.body.userLoginUsername,
                    password: req.body.userLoginPassword,
                    userHash: req.body.userHash,
                    userSalt: req.body.userSalt
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

            return res.status(201).json(response);
        }
        else{
            console.log("Invalid query");
            return res.status(400).json({error: error.message});
        }



    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

httpsServer.listen(PORT, () => {
    console.log(`Encryption server listening on port ${PORT}...`);
});
