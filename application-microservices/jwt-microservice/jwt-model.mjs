
import jwt from 'jsonwebtoken'
import 'dotenv/config';

// const SECRET_KEY = process.env.SECRET;

const SECRET = 'ChangeLater';

// make async for mysql
const signJwtToken = (user) => {

    const { userUsername, userID, user2FAEnabled } = user;

    // TODO: Include SESSION ID in signature
    // include SESSION ID column in User table 
    // when user logs out / closes browser --> clear session ID
    const token = jwt.sign({
        userUsername,
        userID
    }, SECRET, { expiresIn: '3hr' }); // Adjust expiresIn as needed
    console.log(`token created at signJwtToken ${token}`);

    return token
}

// Exports for jwt microservice-controller
export { signJwtToken };