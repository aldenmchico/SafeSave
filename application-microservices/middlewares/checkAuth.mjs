import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
config({ path: '../jwt-microservice/.env' });

// const SECRET = process.env.SECRET;

export const checkAuth = (req, res, next) => {
    /*
    Middleware function to authenticate client Cookie
    */

    console.log('req.cookies is: ', req.cookies);
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('No token found');
    }

    try {

        // TODO: Change SECRET at prod 
        // const SECRET = 'ced3cf93230c634299151337bcd1ccca68d881107703ae6183a78e080a3bb4c03dc9dead55ee3c1027c56018a4dc68b9340b025239c23c964dfa5c271014f980';

        const SECRET = 'ChangeLater'
        jwt.verify(token, SECRET, (err, verifiedToken) => {
            if (err) {

                console.log(`SECRET IS ${SECRET}`);
                console.log(`Error in checkAuth ${err}`);

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token is expired." });
                } else {
                    return res.status(403).json({ message: "Invalid token" });
                }
            }

            // set req.user payload schema 
            req.user = {
                userUsername: verifiedToken.userUsername,
                userID: verifiedToken.userID,
            };
            next();
        });
    } catch (error) {
        res.clearCookie("access_token");
        return res.status(500).json({ error: "Error verifying token, clearing cookies." });
    }
};
