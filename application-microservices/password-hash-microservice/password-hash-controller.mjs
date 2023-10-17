import 'dotenv/config';
import express from 'express';
import * as passwordHashModel from './password-hash-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// GET /hashed-password
// Request: Request body is a JSON object with plaintext user account password for SafeSave
// Response: Success - Response contains password + salt hash using bcrypt
    // Status Code: 201
// Response: Failure - Request is invalid
    // Body: JSON object Error
    // Status Code: 400

app.get ('/hashed-password', (req, res) => { 
    passwordHashModel.getPasswordHash(
        )
        .then(hashedPassword => {
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