import 'dotenv/config';
import express from 'express';
import * as userLoginModel from './user-login-model.mjs';
import bcrypt from 'bcrypt';
import cors from 'cors';


// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// Enable All CORS Requests
app.use(cors());


app.post('/login/validation', cors(), async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    console.log(`Checking login validation for username:[${username}]...`);

    try {
        // verify username exists
        const userExists = await userLoginModel.checkIfUsernameExists(username);
        if (!userExists) {
            console.log(`User ${username} does not exist.`);
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // validate password against stored hash
        const passwordsMatch = await userLoginModel.validatePassword(username, password);
        if (!passwordsMatch) {
            console.log(`Invalid password attempt for ${username}.`);
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // UPDATE: unencrypted password and user ID from the database needs to be saved in a token / .env file from application-backend or somewhere

        // If all validations pass, send a success response.
        return res.status(200).json({ message: "Login successful." });

    } catch (error) {
        // current implementation - model file handles nonexistent user... this catch block never hits 
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
        const usernameOrEmailExists = await userLoginModel.checkIfUsernameOrEmailExists(username, email);
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



app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});