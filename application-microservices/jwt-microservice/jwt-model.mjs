
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import crypto from 'crypto';
import mysql from 'mysql';
import * as db from "./db-connector.mjs";


// const SECRET_KEY = process.env.SECRET;

const con = mysql.createConnection(db.dbConfig);

//TODO
const SECRET = 'ChangeLater';


const signJwtToken = (user) => {
    try{
        const sessionID = crypto.randomBytes(16).toString('hex');
        const userUsername = user.userUsername;
        const userID = user.userID;

        const hmac = crypto.createHmac('sha256', SECRET)
            .update(userUsername + userID + sessionID)
            .digest('hex');

        const query = 'UPDATE Users SET userSessionID = ? WHERE userID = ?';
        con.query(query, [hmac, userID]);

        console.log('Query executed successfully');

        const token = jwt.sign({
            userUsername,
            userID,
            sessionID
        }, SECRET, { expiresIn: '3hr' });

        console.log(`Token created at signJwtToken: ${token}`);
        return token;
    } catch (error) {
        console.error('Error in signJwtToken:', error);
        throw error;
    }
};


// Exports for jwt microservice-controller
export { signJwtToken };