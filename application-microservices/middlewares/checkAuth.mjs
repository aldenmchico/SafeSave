import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
config({ path: '../jwt-microservice/.env' });

const SECRET = process.env.SECRET;

export const checkAuth = (req, res, next) => {
    /*
    Middleware function to authenticate client Cookie
    */
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('No token found');
    }

    try {
        jwt.verify(token, SECRET, (err, verifiedToken) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token is expired." });
                } else {
                    return res.status(403).json({ message: "Invalid token" });
                }
            }  

            // Assuming the payload structure here
            req.user = {
                username: verifiedToken.userUsername,
                id: verifiedToken.userID,
            };
            next();
        });
    } catch (error) {
        res.clearCookie("access_token");
        return res.status(500).json({ error: "Error verifying token, clearing cookies." });
    }
};
