import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
config({ path: '../jwt-microservice/.env' });
import mysql from 'mysql';
import * as db from "./db-connector.mjs"
import crypto from 'crypto';
import fs, {readFileSync} from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const con = mysql.createPool(db.dbConfig);
const getUserSession = (userID) => {

    return new Promise((resolve, reject) => {
        const sessionQuery = `SELECT userSessionID FROM Users WHERE userID = ?`;

        const values = []
        values.push(userID)
        con.query(sessionQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                const userSessionID = result[0] ? result[0].userSessionID : null;
                console.log('Retrieved userSessionID:', userSessionID);
                resolve(userSessionID);
            }
        });
    });
};

export const checkAuth = async (req, res, next) => {
    /*
    Middleware function to authenticate client Cookie
    */

    const KeyPath = path.resolve(__dirname, 'authSecret.txt');

    const SECRET = fs.readFileSync(KeyPath).toString('hex')


    console.log('req.cookies is: ', req.cookies);
    let token;

    try {
        if (req.body.access_token !== undefined) {
            token = req.body.access_token;
        } else if (req.cookies.access_token) {
            token = req.cookies.access_token
        }
    }catch(e){
        console.log(e)
    }
    if (!token) {
        return res.status(401).json('No token found');

    }


    try {


        //TODO: Update secret when going live
        jwt.verify(token, SECRET, async (err, verifiedToken) => {
            if (err) {

                console.log(`SECRET IS ${SECRET}`);
                console.log(`Error in checkAuth ${err}`);

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({message: "Token is expired."});
                } else {
                    return res.status(403).json({message: "Invalid token"});
                }
            }

                const dbSessionID = await getUserSession(verifiedToken.userID);

                const validateHMAC = (userUsername, userID, sessionID, storedHMAC) => {
                    const computedHMAC = crypto.createHmac('sha256', SECRET)
                        .update(userUsername + userID + sessionID)
                        .digest('hex');

                    console.log("Computed hmac", computedHMAC)
                    console.log("stored hmac", storedHMAC)

                    return computedHMAC === storedHMAC;
                };

                const validationHmacCheck = validateHMAC(verifiedToken.userUsername, verifiedToken.userID, verifiedToken.sessionID, dbSessionID)


                console.log("VALIDATION CHECK", validationHmacCheck)




                if (validationHmacCheck !== true) {
                    console.log("HMAC CHECK FAILED")
                    return res.status(403).json({message: "Invalid token"})
                }
                else{
                    console.log("VALIDATION FOR HMAC CHECK PASSED")
                }

            // set req.user payload schema
            req.user = {
                userUsername: verifiedToken.userUsername,
                userID: verifiedToken.userID,
                sessionID: verifiedToken.sessionID
            };

            //
            const hmac = crypto.createHmac('sha256', SECRET)
                .update(req.user.userUsername + req.user.userID + req.user.sessionID)
                .digest('hex');


            try {
                const query = 'UPDATE Users SET userSessionID = ? WHERE userID = ?';
                con.query(query, [hmac, verifiedToken.userID], (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                    console.log('Update successful:', results);
                });
            } catch (error) {

                console.error('Error updating user session ID:', error);
            }
            next();
        });
    } catch (error) {
        res.clearCookie("access_token");
        return res.status(500).json({ error: "Error verifying token, clearing cookies." });
    }
};

