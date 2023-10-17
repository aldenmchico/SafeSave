import 'dotenv/config';
import express from 'express';
import * as twoFACodeModel from './two-factor-authentication-code-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// GET /authcode
// Request: Request body is a JSON object with the user's email
// Response: Success - Response contains JSON object with the authentication code sent via 2FA
    // Status Code: 201
// Response: Failure - Request is invalid
    // Body: JSON object Error
    // Status Code: 400

app.get ('/authcode', (req, res) => { 
    twoFACodeModel.get2FACode(
        )
        .then(authCode => {
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