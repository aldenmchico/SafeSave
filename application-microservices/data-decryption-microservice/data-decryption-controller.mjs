import 'dotenv/config';
import express from 'express';
import path from 'path';

// HTTPS
import https from 'https';
import { readFileSync } from 'fs';

// Obtain __dirname in an ES module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dataDecryptionModel from "./data-decryption-model.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import * as db from "./db-connector.mjs";

const privateKeyPath = path.resolve(__dirname, 'key.pem');
const certificatePath = path.resolve(__dirname, 'cert.pem');

let privateKey;
let certificate;

try {
    privateKey = readFileSync(privateKeyPath, 'utf8');
    certificate = readFileSync(certificatePath, 'utf8');
} catch (error) {
    console.error('Error reading SSL certificate files:', error);
    process.exit(1);
}

const passphrase = process.env.SSL_PASSPHRASE;
const creds = { key: privateKey, cert: certificate, passphrase: passphrase };

// Configure express server
const PORT = process.env.PORT || 3001; // Port 3000 because I do not know which port we will be using yet. Port 3000 is
// the port for encryption
const app = express();

app.use(express.json());
app.use(express.static('public'));

import('ejs');

app.set('view engine', 'ejs');

const httpsServer = https.createServer(creds, app);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/decrypttext', async (req, res) => {
    const {userNoteID, userNoteTitle, userNoteText, userNoteCreated, userNoteUpdated, userNoteAccessed,
        userID, userNoteIV, userNoteTextIV, userHash, userLoginItemID, userLoginItemWebsite, userLoginItemPassword,
    userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, userLoginItemUsername, websiteIV,
        usernameIV, passwordIV, authTag, favorited} = req.body

    const getUserSalt = (userID) => {
        return new Promise((resolve, reject) => {
            const saltQuery = `SELECT userSalt FROM Users WHERE userID = ?`;
            db.pool.query(saltQuery, [userID], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const userSalt = result[0] ? result[0].userSalt : null;
                    resolve(userSalt);
                }
            });
        });
    };

    if(req.body.userLoginItemID && userLoginItemWebsite && userLoginItemUsername && userLoginItemPassword && userLoginItemDateCreated && userLoginItemDateUpdated
    && userLoginItemDateAccessed && websiteIV){

        
        const userSalt = await getUserSalt(userID);
        const result = await dataDecryptionModel.getDecryptedData({
            userLoginItemID: userLoginItemID,
            userLoginItemWebsite: userLoginItemWebsite,
            userLoginItemUsername: userLoginItemUsername,
            userLoginItemPassword: userLoginItemPassword,
            userLoginItemDateCreated: userLoginItemDateCreated,
            userLoginItemDateUpdated: userLoginItemDateUpdated,
            userLoginItemDateAccessed: userLoginItemDateAccessed,
            userHash: userHash,
            websiteIV: websiteIV,
            usernameIV: usernameIV,
            passwordIV: passwordIV,
            authTag: authTag,
            favorited: favorited,
            userSalt: userSalt
        });
        res.status(201).json(result);
    }

    else
    {
        try {


            const userSalt = await getUserSalt(userID);
            // Perform the decryption with the hexadecimal IV
            const result = await dataDecryptionModel.getDecryptedData({
                userNoteID: userNoteID,
                userNoteTitle: userNoteTitle,
                userNoteText: userNoteText,
                userNoteCreated: userNoteCreated,
                userNoteUpdated: userNoteUpdated,
                userNoteAccessed: userNoteAccessed,
                userID: userID,
                userNoteIV: userNoteIV,
                userNoteTextIV: userNoteTextIV,
                userHash: userHash,
                authTag: authTag,
                favorited: favorited,
                userSalt: userSalt
            });
            res.status(201).json(result);
        } catch (error) {
            console.error('Decryption failed:', error);
            res.status(400).json({error: error.message});
        }
    }
});



app.get('/', async (req, res) => {
    const queryDatabase = `SELECT * FROM UserNotes`;

    await db.pool.query(queryDatabase, function(error, notes, fields) {
        if (error) {
            console.log(error);
            res.send('An error occurred while fetching data from the database.');
        } else {
            res.render('table', { notes });
        }
    });
});


httpsServer.listen(PORT, () => {
    console.log(`Decryption server listening on port ${PORT}...`);
});
