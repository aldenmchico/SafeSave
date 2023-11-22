
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import crypto from 'crypto';
import mysql from 'mysql';
import * as db from "./db-connector.mjs";
import {readFileSync} from "fs";



const con = mysql.createConnection(db.dbConfig);

//TODO: Update secret when going live



const signJwtToken =  (user, sessionID) => {
    try{

        const SECRET = readFileSync("authSecret.txt").toString('hex')
        const hmac = crypto.createHmac('sha256', SECRET)
            .update(user.userUsername + user.userID + sessionID)
            .digest('hex');


        const sessionIDQuery = `UPDATE Users SET userSessionID = ? WHERE userID = ?`;

        console.log(`user is ${user} and userID is ${user.userID} in signJwtToken()`); 

        con.query(sessionIDQuery, [hmac, user.userID], (error, results, fields) => {
            if (error) {
                console.error("Error updating user session ID:", error);
                // Handle the error, you might want to send an error response to the client or take other appropriate actions.
            } else {
                // The query was successful, you can do something with the results or simply acknowledge the update.
                console.log("User session ID updated successfully");
            }
        });



        const userUsername = user.userUsername;
        const userID = user.userID;




        console.log('Query executed successfully');

        const token = jwt.sign({
            userUsername,
            userID,
            sessionID
        }, SECRET, { expiresIn: '1hr' });


        console.log(`Token created at signJwtToken: ${token}`);
        return token;
    } catch (error) {
        console.error('Error in signJwtToken:', error);
        throw error;
    }
};


// Exports for jwt microservice-controller
export { signJwtToken };