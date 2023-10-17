import 'dotenv/config';
import express from 'express';
import * as passwordGeneratorModel from './password-generator-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// GET /random-password
// Request: Request body is a JSON object with parameters for the randomly generated password
// Response: Success - Response contains randomly generated password
    // Status Code: 201
// Response: Failure - Request is invalid
    // Body: JSON object Error
    // Status Code: 400

app.get ('/random-password', (req, res) => { 
    passwordGeneratorModel.getRandomPassword(
        )
        .then(randomPassword => {
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