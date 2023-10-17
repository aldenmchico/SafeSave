import 'dotenv/config';
import express from 'express';
import * as dataEncryptionModel from './data-encryption-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// GET /ciphertext
// Request: Request body is a JSON object with plaintext data and user's hash to be used for AES decryption
// Response: Success - Response contains encrypted data from plaintext data
    // Status Code: 201
// Response: Failure - Request is invalid
    // Body: JSON object Error
    // Status Code: 400

app.get ('/ciphertext', (req, res) => { 
    dataEncryptionModel.getEncryptedData(
        )
        .then(encryptedData => {
        })
        // Catch will occur if one of the fields is invalid
        .catch(error => {
            res.status(400).json(error);
        });
    }
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});