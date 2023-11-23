// Import dependencies.
import 'dotenv/config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {readFileSync} from "fs";
import * as db from "./db-connector.mjs";
import mysql from 'mysql';

const con = mysql.createConnection(db.dbConfig);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const checkIfUsernameOrEmailExists = async (username, email) => {
    /*
    Error code 404 = entity does not exist ; not an system error.. interpret as a valid response
    */
    let usernameExists = false;
    let emailExists = false;

    try {
        const usernameResponse = await fetch(`https://localhost:3001/users/byUsername/${username}`);
        console.log(`usernameResponse is: ${usernameResponse}`); 
        if (usernameResponse.ok) {
            const usernameData = await usernameResponse.json();
            console.log(`Username exists: `, usernameData);
            usernameExists = true;
        } else if (usernameResponse.status === 404) {
            console.log('Username does not exist.');
        } else {
            throw new Error('An error occurred while checking the username.');
        }

        const emailResponse = await fetch(`https://localhost:3001/users/byEmail/${email}`);
        if (emailResponse.ok) {
            const emailData = await emailResponse.json();
            console.log(`Email exists: `, emailData);
            emailExists = true;
        } else if (emailResponse.status === 404) {
            console.log('Email does not exist.');
        } else {
            throw new Error('An error occurred while checking the email.');
        }

        return usernameExists || emailExists;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Re-throw the error to handle it in the calling context.
    }
};



const createUser = async (username, email, password) => {
    try {

        const userSalt = crypto.randomBytes(16).toString('hex');

        //TODO: CHANGE SECRET KEY FILE UPON HOSTING LIVE
        const secretKey = readFileSync("secret_key", "utf-8");
        const emailHMAC = crypto.createHmac('sha256', secretKey);

        const digestedEmailHMAC = emailHMAC.update(email).digest('hex')

        const userHMAC = crypto.createHmac('sha256', secretKey)
        const digestedUserHMAC = userHMAC.update(username).digest('hex');

        //TODO: CHANGE KEYS UPON HOSTING
        const pubKey = readFileSync("public-useremail.pem")
        const privKey = readFileSync("private-useremail-key.pem")

        const encryptedUsername =  crypto.publicEncrypt({key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING},
            Buffer.from(username)).toString('hex');

        const encryptedEmail = crypto.publicEncrypt({key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING},
            Buffer.from(email)).toString('hex');


        // Prepare data for the POST request
        // TODO: assumption...data needs to be encrypted/hashed
        const postData = {
            username: encryptedUsername,
            email: encryptedEmail,
            password: password,
            userSalt: userSalt,
            userHMAC: digestedUserHMAC,
            userEmailHMAC: digestedEmailHMAC

        };

        const createResponse = await fetch(`https://localhost:3001/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });

        if (!createResponse.ok) {
            const errorBody = await createResponse.json(); // Assuming server sends JSON response with error details
            const error = new Error('An error occurred while creating the user.');
            error.status = createResponse.status;
            error.details = errorBody.error;
            throw error;
        }
        const responseData = await createResponse.json();
        console.log(`User created: `, responseData);
        return responseData;
    } catch (error) {
        console.error('Error in creating a user:', error.message);
    }
}

const checkIfUsernameExists = async (username) => {
    try {
        const secretKey = readFileSync("secret_key", "utf-8");
        const userHMAC = crypto.createHmac('sha256', secretKey)
        const digestedUserHMAC = userHMAC.update(username).digest('hex');

        const response = await fetch(`https://localhost:3001/users/byUsername/${username}`)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`username found: `, data);
        if (data) {
            return true;
        }
        return false;
    } catch (error) {
        console.log('There was a problem with the fetch operation:', error.message);
    }
}

const getUserHashedPassword = (userID) => {
    return new Promise((resolve, reject) => {
        const passQuery = `SELECT userPassword FROM Users WHERE userID = ?`;

        const values = [userID];
        con.query(passQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                const userPassword = result[0] ? result[0].userPassword : null;
                console.log('Retrieved userPassword:', userPassword);
                resolve(userPassword);
            }
        });
    });
};


const fetchUserFromUsername = async (username) => {
    try {

        const secretKey = readFileSync("secret_key", "utf-8");
        const userHMAC = crypto.createHmac('sha256', secretKey)
        const digestedUserHMAC = userHMAC.update(username).digest('hex');

        const response = await fetch(`https://localhost:3001/users/byUsername/${username}`)
        if (!response.ok) {
            console.log(`response was ${response.toString()}`)
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`username found in fetchUser: `, data);
        if (data) {
            return data;
        }
        return null;
    } catch (error) {
        console.log('There was a problem with the fetch operation:', error.message);
    }
}

const validatePassword = async (username, plainTextPassword) => {

    /*
    Assumptions: username is verified / already defined
    - pass username externally
    */
    try {
        const response = await fetch(`https://localhost:3001/users/byUsername/${username}`)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`user data found in validatePassword: `, data);
        const hashedPassword = await getUserHashedPassword(data[0].userID)

        console.log(`hashedPassword is ${hashedPassword}`);

        const temp_password = await bcrypt.hash(plainTextPassword, 10);
        console.log(`temp_password is ${temp_password}`); 

        // load hashed password field from username
        const hashesAreTheSame = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (hashesAreTheSame === true) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log('There was a problem with the fetch operation:', error.message);
    }
}

const signJwtToken = async (user) => {

    try {

        const jwtResponse = await fetch(`https://localhost:8015/jwt-api/sign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user })
        });

        if (!jwtResponse.ok) {
            throw new Error('Network response was not ok in signjwtToken');
        }

        const jwtData = await jwtResponse.json();
        // console.log(`jwt data found in signJwtToken: `, jwtData);
        return jwtData

    } catch (error) {
        console.log('There was a problem with the fetch operation:', error.message);
    }

}

const hashPasswordAndUpdateExistingUser = async (plainTextPassword, userId) => {
    const saltRounds = 10;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        // console.log(`hashed password when patching is: ${hashedPassword}`);

        // Prepare data for the PATCH request
        const patchData = {
            password: hashedPassword,
            userID: userId
        };

        // Send PATCH request to update user's password
        const response = await fetch(`/users/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`User updated: `, data);
        return data;
    } catch (error) {
        console.error('Error in hashing password or updating user:', error.message);
    }
}


// Exports for genre-microservice-controller
export {
    validatePassword, checkIfUsernameExists, checkIfUsernameOrEmailExists,
    createUser, fetchUserFromUsername, signJwtToken
};
