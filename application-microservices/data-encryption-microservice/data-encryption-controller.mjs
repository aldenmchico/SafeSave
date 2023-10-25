import 'dotenv/config';
import express from 'express';
import * as dataEncryptionModel from './data-encryption-model.mjs';
import path from 'path';
// Configure express server
const PORT = process.env.PORT || 3000; //Port 3000 because I do not know which port we will be using yet
const app = express();
app.use(express.json());
app.use(express.static('public'))

// GET /ciphertext
app.get('/ciphertext', (req, res) => {
    const { plaintext, userHash } = req.query;

    try {
        dataEncryptionModel.getEncryptedData(plaintext, userHash)
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
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
