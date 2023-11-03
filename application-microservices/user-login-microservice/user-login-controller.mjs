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


app.post('/login/validation', async (req, res) => {
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

        // create a new user entry in db 
        const createdUser = await userLoginModel.createUser(username, email, password);
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

app.patch('/users/', async (req, res) => {

    const { password, userId } = req.body;

    try {

        // Update the user's password with the new hashed password
        const result = await userLoginModel.hashPasswordAndUpdateExistingUser(password, userId);

        if (result) {
            res.status(200).json({ message: 'User password updated successfully' });
        } else {
            res.status(500).json({ message: 'Error updating user password' });
        }
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});