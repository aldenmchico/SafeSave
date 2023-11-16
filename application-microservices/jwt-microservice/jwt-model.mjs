
import jwt from 'jsonwebtoken'
import 'dotenv/config';

const SECRET_KEY = process.env.SECRET;

const signJwtToken = (user) => {

    const { userUsername, userID, user2FAEnabled } = user;
    const token = jwt.sign({
        userUsername,
        userID
    }, SECRET_KEY, { expiresIn: '3hr' }); // Adjust expiresIn as needed
    console.log(`token created at signJwtToken ${token}`);

    return token
}

// Exports for jwt microservice-controller
export { signJwtToken };