import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

import * as jwtModel from './jwt-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieparser());

// Enable All CORS Requests
app.use(cors());

app.get('/jwt-api', cors(), async (req, res) => {
    res.status(200).json({ message: 'Welcome to jwt-controller!' });
})

app.get('/jwt-api/cookies', function (req, res) {
    /*
    Function to list all cookies
    */
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
})

app.post('/jwt-api/sign', cors(), (req, res) => {
    /*
    Function to create, sign and return JWT in a cookie 
    */

    const { user } = req.body   // grab User from login-controller - only time I ask for User (curr only sending username, id and 2faenabled ) 

    if (!user) {
        return res.status(400).json({ error: "User data is required" });
    }

    console.log(`Beginning JWT token creation for user:`, user);

    try {
        // sign a JWT using User
        const token = jwtModel.signJwtToken(user);

        // If all validations pass, send a success response.
        return res.status(200).json({ message: "Token creation successful.", token: token });

    } catch (error) {
        console.error(`Error signing token ${username}: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});