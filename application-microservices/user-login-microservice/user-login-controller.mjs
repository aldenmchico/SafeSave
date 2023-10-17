import 'dotenv/config';
import express from 'express';
import * as userLoginModel from './user-login-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// GET /login/validation
// Request: Request body is a JSON object with the user's entered login credentials
// Response: Success - Response contains JSON object with true if the login credentials match what is in the DB, false o.w.
    // Status Code: 201
// Response: Failure - Request is invalid
    // Body: JSON object Error
    // Status Code: 400

app.get ('/login/validation', (req, res) => { 
    userLoginModel.validateLogin(
        )
        .then(validationResult => {
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