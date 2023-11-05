import 'dotenv/config';
import express from 'express';
import * as dataEncryptionModel from './data-encryption-model.mjs';
import path from 'path';

var db = import("./db-connector.cjs")

// HTTPS
import https from 'https';
import { readFileSync } from 'fs';

// Obtain __dirname in an ES module
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

// Configure express server
const PORT = process.env.PORT || 3000; // Port 3000 because I do not know which port we will be using yet
const app = express();

app.use(express.json());
app.use(express.static('public'));

const httpsServer = https.createServer(creds, app);

// POST /ciphertext
app.post('/ciphertext', (req, res) => {
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
        dataEncryptionModel.getEncryptedData(
            noteTitle,
            noteText,
            noteCreatedDate,
            noteUpdatedDate,
            noteAccessedDate,
            userID,
            userHash,
        )
            .then((result) => {
                res.status(201).json(result);
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



app.get('/', (req, res) => {
    const htmlFilePath = 'public/index.html';
    const normalizedPath = path.normalize(htmlFilePath);
    res.sendFile(normalizedPath);
});

httpsServer.listen(PORT, () => {
    console.log(`Encryption server listening on port ${PORT}...`);
});
