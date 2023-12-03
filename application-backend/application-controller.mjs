import 'dotenv/config';
import express from 'express';
import * as appModel from './application-model.mjs';

import cors from 'cors';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
import path from 'path';

import cookieparser from 'cookie-parser';

app.use(cookieparser());

import https from 'https';
import { checkAuth } from '../application-microservices/middlewares/checkAuth.mjs';

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const passphrase = process.env.SSL_PASSPHRASE;
const creds = { key: privateKey, cert: certificate, passphrase: passphrase };

const httpsServer = https.createServer(creds, app);


//Added local laptop IP for testing from different computers in my network
//CORS is VERY picky about the origin IP; app.use(cors()) is not strict enough when dealing with any sort of cookie
//which is the reason why localhost worked, and 127.0.0.1 didn't and vice-versa.
//allowed origins will EVENTUALLY have our domain name at port 443 once we host!
const allowedOrigins = ['https://localhost:3000', 'https://127.0.0.1:3000', 'https://192.168.88.79:3000', 'https://107.181.189.57:7263']

app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the list of allowed origins or if it's a browser preflight request
        const isAllowed = allowedOrigins.some(allowedOrigin =>
            new RegExp(allowedOrigin).test(origin)
        );

        if (isAllowed || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

const userRouter = express.Router();
const loginItemRouter = express.Router();
const notesRouter = express.Router();

app.use('/users', userRouter);
app.use('/login_items', loginItemRouter);
app.use('/notes', notesRouter);



// CREATE (POST) controller ******************************************

// POST REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

// POST Users Table endpoint ****************************************************
userRouter.post('/', (req, res) => {
    appModel.createUser(req.body, (err, result) => {
        if (err) {
            console.error(err); // Log detailed error for server-side troubleshooting
            if (err.code === "EMPTY_FIELD") res.status(406).send({ "error": `${err.code} - Not all fields populated.` });
            else if (err.code === 'ER_DUP_ENTRY') res.status(409).send({ "error": `${err.code} - Conflict between entered values and data in database.` });
            else res.status(400).send({ "error": `Bad Request.` });
        }
        else {
            if (result.length == 0) res.status(400).send({ "error": "Could not create user." });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(201).send({ "insertId": `${result.insertId}` });
            }
        }
    })
});

// POST UserLoginItems Table endpoint ****************************************************
loginItemRouter.post('/', checkAuth, (req, res) => {
    const { userID } = req.user;
    appModel.createUserLoginItem(userID, req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "EMPTY_FIELD") res.status(406).send({ "error": `${err.code} - Not all fields populated.` });
            else res.status(400).send({ "error": `${err.code} - Bad Request in loginItemRouter.post.` });
        }
        else {
            if (result.length == 0) res.status(400).send({ "error": "Could not create user login item" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(201).send({ "insertId": `${result.insertId}` });
            }
        }
    })
});

// POST UserNotes Table endpoint ****************************************************
notesRouter.post('/', checkAuth, (req, res) => {
    const { userID } = req.user;
    appModel.createUserNote(userID, req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "EMPTY_FIELD") res.status(406).send({ "error": `${err.code} - Not all fields populated.` });
            else res.status(400).send({ "error": `${err.code} - Bad Request in notesRouter.post.` });
        }
        else {
            if (result.length == 0) res.status(400).send({ "error": "Could not create user login item" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(201).send({ "insertId": `${result.insertId}` });
            }
        }
    })
});

// GET HTTP ENDPOINTS ****************************************************

// GET Users Table endpoints ****************************************************

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

userRouter.get('/byUsername/:username', (req, res) => {
    appModel.getUserByUsername(req.params.username, (err, result) => {
        console.log(`byUsernameReq: ${req}`);
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.length == 0) res.status(404).send({ "error": "Username not found" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

userRouter.get('/byEmail/:email', (req, res) => {
    appModel.getUserByEmail(req.params.email, (err, result) => {
        if (err) {
            // Log the actual error internally, but don't send it to the client
            console.error(err);
            res.status(400).send({ "error": "Bad Request." });
        } else {
            if (result.length == 0) {
                res.status(404).send({ "error": "User email not found." });
            } else {
                console.log(result);  // Be cautious about logging sensitive information in a production environment
                res.set('Content-Type', 'application/json');
                res.status(200).send(result); // Express can stringify the result directly
            }
        }
    });
});




loginItemRouter.get('/users/userID', checkAuth, (req, res) => {
    const { userID } = req.user;
    console.log(`loginItemRouter/users/userID, userID is: ${userID}`)
    appModel.getSingleUserLoginItems(userID, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.length === 0) res.status(404).send({ "error": "No user login items found for specified user ID" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

loginItemRouter.get('/users/id/favorites', checkAuth, (req, res) => {
    const { userID } = req.user;
    appModel.getSingleUserLoginItemsFavorites(userID, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.length === 0) res.status(404).send({ "error": "No user favorite items found for specified user ID" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

// loginItemRouter.get('/users/:id/website/:website', (req, res) => {
//     appModel.getUserLoginItemByWebsite(req.params.id, req.params.website, (err, result) => {
//         if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
//         else {
//             if (result.length == 0) res.status(404).send({ "error": "No user login items found for specified user ID with given website" });
//             else {
//                 console.log(result);
//                 res.set('Content-Type', 'application/json');
//                 res.status(200).send(JSON.stringify(result));
//             }
//         }
//     })
// });

loginItemRouter.get('/users/:id/username/:username', (req, res) => {
    appModel.getUserLoginItemByUsername(req.params.id, req.params.username, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.length == 0) res.status(404).send({ "error": "No user login items found for specified user ID with given username" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});



notesRouter.get('/users/userID', checkAuth, (req, res) => {
    const { userID } = req.user;
    appModel.getSingleUserNotes(userID, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.length == 0) res.status(404).send({ "error": "No notes found for specified user ID" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

notesRouter.get('/users/id/favorites', checkAuth, (req, res) => {
    const { userID } = req.user;
    appModel.getSingleUserNotesFavorites(userID, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.length === 0) res.status(404).send({ "error": "No user login items found for specified user ID" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

// notesRouter.get('/users/:id/title/:title', checkAuth, (req, res) => {
//     appModel.getUserNoteByTitle(req.params.id, req.params.title, (err, result) => {
//         if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
//         else {
//             if (result.length == 0) res.status(404).send({ "error": "No notes found for specified user ID with given title" });
//             else {
//                 console.log(result);
//                 res.set('Content-Type', 'application/json');
//                 res.status(200).send(JSON.stringify(result));
//             }
//         }
//     })
// });

// UPDATE (PATCH) controller ************************************

// PATCH REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT


userRouter.patch('/', checkAuth,(req, res) => {
    appModel.patchUser(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_USER_ID") res.status(406).send({ "error": `${err.code} - User ID required to update user information.` });
            else if (err.code === "NO_CHANGE") res.status(404).send({ "error": `${err.code} - User information not modified.` });
            else res.status(400).send({ "error": `${err.code} - Bad Request.` });
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            // res.status(200).end();
            res.status(200).json({ message: "User updated successfully" });
        }
    })
});

loginItemRouter.patch('/', checkAuth, (req, res) => {
    const { userID } = req.user;
    appModel.patchLoginItem(userID, req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_ID") res.status(406).send({ "error": `${err.code} - User ID required to update user information.` });
            else if (err.code === "NO_CHANGE") res.status(404).send({ "error": `${err.code} - User information not modified.` });
            else res.status(400).send({ "error": `${err.code} - Bad Request.` });
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).end();
        }
    })
});

userRouter.patch('/session', checkAuth,(req, res) => {
    appModel.nullSessionID(req.body, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.affectedRows === 0) res.status(404).send({ "error": "No users found with specified user ID in PATCH /session" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(204).end();
            }
        }
    })
});

loginItemRouter.patch('/favorite', checkAuth, (req, res) => {
    appModel.patchLoginItemFavorite(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_ID") res.status(406).send({ "error": `${err.code} - User ID required to update user information.` });
            else res.status(400).send({ "error": `${err.code} - Bad Request.` });
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).end();
        }
    })
});


notesRouter.patch('/', checkAuth, (req, res) => {
    const { userID } = req.user;
    appModel.patchNote(userID, req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_ID") res.status(406).send({ "error": `${err.code} - User ID required to update user information.` });
            else if (err.code === "NO_CHANGE") res.status(404).send({ "error": `${err.code} - User information not modified.` });
            else res.status(400).send({ "error": `${err.code} - Bad Request.` });
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).end();
        }
    })
});

notesRouter.patch('/favorite', checkAuth,(req, res) => {
    appModel.patchNoteFavorite(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_ID") res.status(406).send({ "error": `${err.code} - User ID required to update user information.` });
            else res.status(400).send({ "error": `${err.code} - Bad Request.` });
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).end();
        }
    })
});

// UPDATE (DELETE) controller ************************************

// DELETE REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

userRouter.delete('/:userId', checkAuth, (req, res) => {
    appModel.deleteUser(req.params.userId, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.affectedRows === 0) res.status(404).send({ "error": "No users found with specified user ID" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(204).end();
            }
        }
    })
});



loginItemRouter.delete('/:loginItemId', checkAuth,(req, res) => {
    appModel.deleteUserLoginItem(req.params.loginItemId, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.affectedRows === 0) res.status(404).send({ "error": "No login items with given login item ID" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(204).end();
            }
        }
    })
});


notesRouter.delete('/:noteId', checkAuth, (req, res) => {
    appModel.deleteNote(req.params.noteId, (err, result) => {
        if (err !== null) res.status(400).send({ "error": `${err.code} - Bad Request.` });
        else {
            if (result.affectedRows === 0) res.status(404).send({ "error": "No notes found for specified user ID with given note ID" });
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(204).end();
            }
        }
    })
});


//HTTPS
httpsServer.listen(PORT, () => {
    console.log(`Express application-controller server started listening on port ${PORT}...`);
});
