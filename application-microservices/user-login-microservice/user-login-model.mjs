// Import dependencies.
import 'dotenv/config';
import bcrypt from 'bcrypt';


const checkIfUsernameExists = async (username) => {
    try {
        const response = await fetch(`http://localhost:4000/users/${username}`)
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

const validatePassword = async (username, plainTextPassword) => {

    /*
    Assumptions: username is verified / already defined
    - pass username externally
    */
    try {
        const response = await fetch(`http://localhost:4000/users/${username}`)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`user data found in validatePassword: `, data);
        const hashedPassword = data[0].userPassword;

        console.log(`hashedPassword is ${hashedPassword}`);

        // load hashed password field from username
        const hashesAreTheSame = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (hashesAreTheSame) return true;
        return false;
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
        const response = await fetch(`http://localhost:4000/users/`, {
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
export { validatePassword, checkIfUsernameExists, hashPasswordAndUpdateExistingUser };