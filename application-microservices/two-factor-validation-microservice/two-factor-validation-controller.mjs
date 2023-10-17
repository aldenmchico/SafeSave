import 'dotenv/config';
import express from 'express';
import * as codeCompareModel from './two-factor-validation-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// GET /authcode/comparison
// Request: Request body is a JSON object with the user's entered 2FA code and the sent 2FA code
// Response: Success - Response contains JSON object with true if the codes match, false o.w.
    // Status Code: 201
// Response: Failure - Request is invalid
    // Body: JSON object Error
    // Status Code: 400

app.get ('/authcode/comparison', (req, res) => { 
    codeCompareModel.validateAuthCode(
        )
        .then(compareResult => {
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