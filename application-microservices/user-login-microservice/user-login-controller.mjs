import 'dotenv/config';
import express from 'express';
import * as userLoginModel from './user-login-model.mjs';
import bcrypt from 'bcrypt';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import mysql from 'mysql';
import * as db from "./db-connector.mjs";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configure express server
const PORT = process.env.PORT;
const app = express();

import https from 'https';
import { readFileSync } from 'fs';

// Obtain __dirname in an ES module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import crypto from "crypto";

import { checkAuth } from '../middlewares/checkAuth.mjs';

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

const creds = { key: privateKey, cert: certificate };
const con = mysql.createConnection(db.dbConfig)
const httpsServer = https.createServer(creds, app);

app.use(express.json());
app.use(cookieparser());



// Enable COR requests from localhost:3000 only

//Added local laptop IP for testing from different computers in my network
//CORS is VERY picky about the origin IP; app.use(cors()) is not strict enough when dealing with any sort of cookie
//which is the reason why localhost worked, and 127.0.0.1 didn't and vice-versa.
//allowed origins will EVENTUALLY have our domain name at port 443 once we host!
const allowedOrigins = ['https://localhost:3000', 'https://127.0.0.1:3000', 'https://192.168.88.79:3000', 'https://107.181.189.57:7263']

app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the list of allowed origins or if it's a browser preflight request
        const isAllowed = allowedOrigins.some(allowedOrigin =>
            new RegExp(allowedOrigin).test(origin)
        );

        if (isAllowed || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));



app.post('/loginvalidation', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    console.log(`Checking login validation for username:[${username}]...`);

    try {

        const secretKey = readFileSync("secret_key", "utf-8");
        const userHMAC = crypto.createHmac('sha256', secretKey)
        const digestedUserHMAC = userHMAC.update(username.toLowerCase()).digest('hex');

        const con = mysql.createConnection(db.dbConfig);



        // verify username exists
        const usernameExists = await userLoginModel.checkIfUsernameExists(digestedUserHMAC);
        console.log("Username exists:", usernameExists);

        if (!usernameExists) {
            console.log(`User ${username} does not exist.`);
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // validate password against stored hash
        const passwordsMatch = await userLoginModel.validatePassword(digestedUserHMAC, password);

        if (!passwordsMatch) {
            console.log(`Invalid password attempt for ${username}.`);
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // fetch user from DB using username
        const fetchedUser = await userLoginModel.fetchUserFromUsername(digestedUserHMAC);

        if (fetchedUser) {
            console.log('user in api endpoint is: ', fetchedUser);

            const { userID, userUsername } = fetchedUser[0];
            console.log(`userID is ${userID}, username is ${userUsername}`);

            const user = { userID, userUsername };

            try {

                res.clearCookie("access_token");

                const clearSessionID = `UPDATE Users SET userSessionID = NULL WHERE userID = ?`

                // con.query(clearSessionID, [user.userID])

                await new Promise((resolve, reject) => {
                    con.query(clearSessionID, [user.userID], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                const tokenResponse = await userLoginModel.signJwtToken(user);

                if (tokenResponse && tokenResponse.token) {
                    // If all validations pass, send a success response.
                    // return res.cookie("access_token", tokenResponse.token, { httpOnly: true }).status(200).json({
                    //     message: "Login successful.",
                    //     user,
                    //     token: tokenResponse.token
                    // });

                    return res.cookie("access_token", tokenResponse.token, {
                        httpOnly: true,
                        // Optional: Add 'secure: true' if using HTTPS
                        secure: true,
                        // Do not set 'Max-Age' or 'Expires'
                    }).status(200).json({
                        message: "Login successful.",
                        user,
                        token: tokenResponse.token
                    });

                } else {
                    throw new Error('Token creation failed');
                }

            } catch (error) {
                console.error(`Error validating credentials for ${username}: ${error.message}`);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    } catch (error) {
        console.error(`Error validating credentials for ${username}: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/create/account', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username and email and password are required." });
    }

    console.log(`Checking account creation for username:[${username}]... and email:[${email}] and password:[${password}]...`);

    try {
        // check if username or email already exists

        const secretKey = readFileSync("secret_key", "utf-8");
        const userHMAC = crypto.createHmac('sha256', secretKey)
        const digestedUserHMAC = userHMAC.update(username.toLowerCase()).digest('hex');
        const emailHMAC = crypto.createHmac('sha256', secretKey)
        const digestedEmailHMAC = emailHMAC.update(email.toLowerCase()).digest('hex');




        const usernameOrEmailExists = await userLoginModel.checkIfUsernameOrEmailExists(digestedUserHMAC, digestedEmailHMAC);
        if (usernameOrEmailExists) {
            console.log(`Username ${username} or email ${email} already exist.`);
            return res.status(401).json({ message: "Username or email already exists." });
        }

        // hash the password here using bcrypt.
        const saltRounds = 10;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        // create a new user entry in db 
        const createdUser = await userLoginModel.createUser(username, email, hashedPassword);
        if (!createdUser) {
            console.log('Error creating a user');
            return res.status(400).json({ message: "Error while creating a user" });
        }

        // If all validations pass, send a success response.
        return res.status(200).json({ message: "Account creation successful." });

    } catch (error) {
        // current implementation - model file handles nonexistent user... this catch block never hits 
        console.error(`Error validating username or email field for ${username} and ${email}: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/logout', checkAuth, async (req, res) => {

    const { userID } = req.user

    const token = req.cookies.access_token;

    try {
        // Prepare data for the PATCH request
        const patchData = {
            userID: userID
        };

        // Send PATCH request to update user's temp secret
        const response = await fetch(`https://localhost:3001/users/session`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: token,
                ...patchData, // Include other properties from patchData
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        res.clearCookie('access_token');
        res.send('Cookie has been deleted successfully');
    } catch (error) {
        console.error('Error in calling /logout from user-login-controller: ', error.message);
    }
});

// app.patch('/users/', async (req, res) => {

//     const { password, userId } = req.body;

//     try {

//         // Update the user's password with the new hashed password
//         const result = await userLoginModel.hashPasswordAndUpdateExistingUser(password, userId);

//         if (result) {
//             res.status(200).json({ message: 'User password updated successfully' });
//         } else {
//             res.status(500).json({ message: 'Error updating user password' });
//         }
//     } catch (error) {
//         console.error('Error updating user:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


httpsServer.listen(PORT, () => {
    console.log(`User login controller server listening on port ${PORT}...`);
});