// Import dependencies.
import 'dotenv/config';
import bcrypt from 'bcrypt';


const checkIfUsernameOrEmailExists = async (username, email) => {
    /*
    Error code 404 = entity does not exist ; not an system error.. interpret as a valid response
    */
    let usernameExists = false;
    let emailExists = false;

    try {
        const usernameResponse = await fetch(`http://localhost:4000/users/byUsername/${username}`);
        if (usernameResponse.ok) {
            const usernameData = await usernameResponse.json();
            console.log(`Username exists: `, usernameData);
            usernameExists = true;
        } else if (usernameResponse.status === 404) {
            console.log('Username does not exist.');
        } else {
            throw new Error('An error occurred while checking the username.');
        }

        const emailResponse = await fetch(`http://localhost:4000/users/byEmail/${email}`);
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



const createUser = async (userId, username, email, password) => {
    try {

        // Prepare data for the POST request
        // TODO: assumption...data needs to be encrypted/hashed
        const postData = {
            userId: userId,
            username: username,
            email: email,
            password: password

            // include uid using uuid 

        };

        const createResponse = await fetch(`http://localhost:4000/users/`, {
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
        const response = await fetch(`http://localhost:4000/users/byUsername/${username}`)
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
        const response = await fetch(`http://localhost:4000/users/byUsername/${username}`)
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
export { validatePassword, checkIfUsernameExists, hashPasswordAndUpdateExistingUser, checkIfUsernameOrEmailExists, createUser };