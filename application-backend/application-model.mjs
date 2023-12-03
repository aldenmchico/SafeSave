// Import dependencies.
import 'dotenv/config';
import mysql from 'mysql';
import * as db from './db-connector.mjs';
const con = mysql.createPool(db.dbConfig);

import https from 'https';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//Date stuff
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const formattedDate = year + '-' + month + '-' + day;

// CREATE (POST) MODEL FUNCTIONS *****************************************

// POST Users Table Model Functions *****************************************
const createUser = function (reqBody, callback) {
    if (reqBody.username === undefined || reqBody.email === undefined || reqBody.password === undefined || reqBody.userSalt === undefined || reqBody.userHMAC === undefined || reqBody.userEmailHMAC === undefined) {
        callback({ "code": "EMPTY_FIELD" }, null);
    }
    else {
        let q = `INSERT INTO Users (userUsername, userEmail, userPassword, userSalt, userHMAC, userEmailHMAC) VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [];

        values.push(reqBody.username, reqBody.email, reqBody.password, reqBody.userSalt, reqBody.userHMAC, reqBody.userEmailHMAC)

        con.query(q, values, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });

    }
}

const getUserSalt = (userID) => {
    return new Promise((resolve, reject) => {
        const saltQuery = `SELECT userSalt FROM Users WHERE userID = ?`;
        con.query(saltQuery, [userID], (err, result) => {
            if (err) {
                reject(err);
            } else {
                const userSalt = result[0] ? result[0].userSalt : null;
                resolve(userSalt);
            }
        });
    });
};


//This is pulling the hash straight from the database. Normally, creating key/iv pairs with what's in the database is
//no better than storing passwords in plaintext. However, IV's are encrypted with a private key prior to be inserted
//into the database. This key does not live in the database.
const getUserHash = (userID) => {
    return new Promise((resolve, reject) => {
        const hashQuery = `SELECT userPassword FROM Users WHERE userID = ?`;
        con.query(hashQuery, [userID], (err, result) => {
            if (err) {
                reject(err);
            } else {
                const userPassword = result[0] ? result[0].userPassword : null;
                resolve(userPassword);
            }
        });
    });
};



// POST UserLoginItems Table Model Functions  *****************************************
const createUserLoginItem = async function (userID, reqBody, callback) {

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const userSalt = await getUserSalt(userID);


    let responseData;
    let userLoginWebsite = reqBody.website;
    let userLoginUsername = reqBody.username;
    let userLoginPassword = reqBody.password;

    const userHash = await getUserHash(userID);


    await fetch('https://127.0.0.1:8002/ciphertext', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userLoginWebsite,
            userLoginUsername,
            userLoginPassword,
            userHash,
            userSalt
        }),
        agent, // to get rid of self-signed errors on SSL cert
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            responseData = data;
            console.log("data is", data);

            let q = `INSERT INTO UserLoginItems (userLoginItemWebsite, userLoginItemUsername, userLoginItemPassword,
    userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, userID, websiteIV, usernameIV, passwordIV, authTag)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [];
            values.push(responseData.encryptedWebsite,
                responseData.encryptedUsername,
                responseData.encryptedPassword,
                formattedDate,
                formattedDate,
                formattedDate,
                userID,
                responseData.websiteIV,
                responseData.usernameIV,
                responseData.passwordIV,
                responseData.authTag)

            con.query(q, values, (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });

        })
        .catch(error => {
            console.error('Error:', error.message);
            callback(error, null);
        });
};




// POST UserNotes Table Model Functions  *****************************************

const createUserNote = async function (userID, reqBody, callback) {

    let noteTitle = reqBody.title;
    let noteText = reqBody.content;
    let noteCreatedDate = reqBody.userNoteDateCreated;
    let noteUpdatedDate = reqBody.userNoteDateCreated;
    let noteAccessedDate = reqBody.userNoteDateCreated;

    const userHash = await getUserHash(userID);

    const userSalt = await getUserSalt(userID);



    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    let responseData; // Variable to store the JSON response

    await fetch('https://127.0.0.1:8002/ciphertext', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            noteTitle,
            noteText,
            noteCreatedDate,
            noteUpdatedDate,
            noteAccessedDate,
            userID,
            userHash,
            userSalt
        }),
        agent, // Include the custom agent here
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            responseData = data;
            console.log("data is", data);

            let q = `INSERT INTO UserNotes (userNoteTitle, userNoteText, userNoteCreated,
          userNoteUpdated, userNoteAccessed, userID, userNoteIV, userNoteTextIV, authTag)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = []

            values.push(responseData.encryptedTitleData, responseData.encryptedNoteData, formattedDate, formattedDate, formattedDate, userID, responseData.iv, responseData.userNoteTextIV, responseData.authTag)

            con.query(q, values, (err, result) => {
                if (err) callback(err, null);
                else callback(null, result);
            });
        })
        .catch(error => {
            console.error('Error:', error.message);
            callback(error, null);
        });
};

// RETRIEVE (GET) MODEL FUNCTIONS *****************************************

// GET Users Table Model Functions  *****************************************

// GET User by Email Model Function *****************************************
const getUserByEmail = async function (email, callback) {
    let q = `SELECT userID FROM Users WHERE userEmailHMAC = ?`;
    con.query(q, [email], (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};



const getUserByUsername = async function (username, callback) {
    const values = [username];
    let q = `SELECT userID FROM Users WHERE userHMAC = ?`;
    con.query(q, values, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};




const getSingleUserLoginItems = function (id, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ?`;
    con.query(q, [id], async (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        try {
            const decryptedResult = await Promise.all(result.map(decryptRowData));
            callback(null, decryptedResult);
        } catch (error) {
            callback(error)
        }
    });
};

const getSingleUserLoginItemsFavorites = function (id, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ? AND favorited = ?`;
    con.query(q, [id, 1], async (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        try {
            const decryptedResult = await Promise.all(result.map(decryptRowData));
            callback(null, decryptedResult);
        } catch (error) {
            callback(error)
        }
    });
};

const getUserLoginItemByWebsite = function (id, website, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ? AND userLoginItemWebsite = ?`;
    con.query(q, [id, website], async (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        try {
            const decryptedResult = await Promise.all(result.map(decryptRowData));
            callback(null, decryptedResult);
        } catch (error) {
            callback(error)
        }
    });
};

const getUserLoginItemByUsername = function (userID, username, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ? AND userLoginItemUsername = ?`;
    con.query(q, [userID, username], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};




const getSingleUserNotes = function (id, callback) {
    let q = `SELECT * FROM UserNotes WHERE userID = ?`;
    con.query(q, [id], async (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        try {
            const decryptedResult = await Promise.all(result.map(decryptRowData));
            console.log("application-model.mjs result", decryptedResult);
            callback(null, decryptedResult);
        } catch (error) {
            callback(error);
        }
    });
};

const getSingleUserNotesFavorites = function (id, callback) {
    let q = `SELECT * FROM UserNotes WHERE userID = ? AND favorited = ?`;
    con.query(q, [id, 1], async (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        try {
            const decryptedResult = await Promise.all(result.map(decryptRowData));
            console.log("application-model.mjs result", decryptedResult);
            callback(null, decryptedResult);
        } catch (error) {
            callback(error);
        }
    });
};

//Helper function to call decryption microservice
async function decryptRowData(row) {
    return new Promise(async (resolve, reject) => {
        var encryptedData = {};
        for (const key in row) {
            encryptedData[key] = row[key];
        }

        // TODO: Fix Hardcoded password!
        // HAVE AUSTIN EXPLAIN WHAT I HAPPENING HERE. DECRYPTION MAY BE FUNKY? 
        // CHECK DATA DECRYPTION CONTROLLER / MODEL

        const userHash = await getUserHash(row.userID);
        const key = "userHash"
        encryptedData[key] = userHash

        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        try {
            const response = await fetch("https://127.0.0.1:8001/decrypttext", {
                method: "POST",
                body: JSON.stringify(encryptedData),
                headers: {
                    'Content-Type': 'application/json'
                },
                agent: agent
            });

            const data = await response.json();
            resolve(data); // Resolve the promise with the decrypted data
        } catch (error) {
            reject(error); // Reject the promise with the error
        }
    });
}


const getUserNoteByTitle = function (id, title, callback) {
    let q = `SELECT * FROM UserNotes WHERE userID = ? AND userNoteTitle = ?`;
    con.query(q, [id, title], async (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        try {
            const decryptedResult = await Promise.all(result.map(decryptRowData, id));
            callback(null, decryptedResult);
        } catch (error) {
            callback(error)
        }
    });
};


// Function to patch user data
const patchUser = function (reqBody, callback) {
    if (reqBody.userID === undefined) {
        callback({ "code": "NO_USER_ID" }, null);
    } else {
        let q = '';
        if (reqBody.email !== undefined) { 
            q += `UPDATE Users SET userEmail = "${reqBody.email}" WHERE userID = ${reqBody.userID}; `;
        }
        if (reqBody.password !== undefined) {
            q += `UPDATE Users SET userPassword = "${reqBody.password}" WHERE userID = ${reqBody.userID}; `;
        } 
        // Additional fields for userSecret and userTempSecret
        if (reqBody.userSecret !== undefined) {
            const secretValue = reqBody.userSecret === null ? null : `"${reqBody.userSecret}"`;
            q += `UPDATE Users SET userSecret = ${secretValue} WHERE userID = ${reqBody.userID}; `;
        }
        if (reqBody.userTempSecret !== undefined) {
            const tempSecretValue = reqBody.userTempSecret === null ? null : `"${reqBody.userTempSecret}"`;
            q += `UPDATE Users SET userTempSecret = ${tempSecretValue} WHERE userID = ${reqBody.userID}; `;
        }
        // Additional fields for user2FAEnabled
        if (reqBody.user2FAEnabled !== undefined) {
            q += `UPDATE Users SET user2FAEnabled = "${reqBody.user2FAEnabled}" WHERE userID = ${reqBody.userID}; `;
        }
        // model function for handling user session id when logging out 
        if (reqBody.userSessionID !== undefined) {
            const tempSessionID = reqBody.userSessionID === null ? null : `"${reqBody.userSessionID}"`;
            q += `UPDATE Users SET userSessionID = ${tempSessionID} WHERE userID = ${reqBody.userID}; `;
        }
        
        if (q === '') {
            callback({ "code": "NO_CHANGE" }, null);
        } else {
            const queries = q.split(';').filter(query => query.trim() !== '');

            // Execute each query sequentially
            executeQuerySequentially(queries, 0, (err, result) => {
                if (err) {
                    console.log('Error:', err);
                    callback(err, null);
                } else {
                    console.log('All queries executed successfully');
                    callback(null, { "message": "All queries executed successfully" });
                }
            });
        }
    }
};

// Function to execute queries sequentially
function executeQuerySequentially(queries, index, callback) {
    if (index >= queries.length) {
        // All queries executed successfully
        callback(null, { "message": "All queries executed successfully" });
        return;
    }

    // Execute the current query
    con.query(queries[index], (err, result) => {
        if (err) {
            console.log(`Error executing query: ${queries[index]}`, err);
            callback(err, null);
        } else {
            console.log(`Query executed successfully: ${queries[index]}`);
            // Move on to the next query
            executeQuerySequentially(queries, index + 1, callback);
        }
    });
}



const patchLoginItem = async function (userID, reqBody, callback) {
    if (reqBody.userLoginItemID === undefined) {
        callback({ "code": "NO_ID" }, null);
    } else {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        let responseData;
        let userLoginWebsite = reqBody.website;
        let userLoginUsername = reqBody.username;
        let userLoginPassword = reqBody.password;

        let userHash = await getUserHash(userID);
        const userSalt = await getUserSalt(userID);

        await fetch('https://localhost:8002/ciphertext', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userLoginWebsite,
                userLoginUsername,
                userLoginPassword,
                userHash,
                userSalt
            }),
            agent, // to get rid of self-signed errors on SSL cert
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                responseData = data;
                console.log("data is", data);

                let q = `UPDATE UserLoginItems SET`;

               const values = [];
                if (reqBody.website !== undefined) {
                    q += ` userLoginItemWebsite = ?,`;
                    values.push(responseData.encryptedWebsite);
                }

                if (reqBody.password !== undefined) {
                    q += ` userLoginItemPassword = ?,`;
                    values.push(responseData.encryptedPassword);
                }

                if (reqBody.username !== undefined) {
                    q += ` userLoginItemUsername = ?,`;
                    values.push(responseData.encryptedUsername);
                }

                q += ` userLoginItemDateUpdated = ?,`;
                q += ` userLoginItemDateAccessed = ?,`;

                q += ` websiteIV = ?,`;
                q += ` usernameIV = ?,`;
                q += ` passwordIV = ?,`;
                q += ` authTag = ?`;

                q += ` WHERE userLoginItemID = ?`;

                values.push(formattedDate, formattedDate, responseData.websiteIV, responseData.usernameIV, responseData.passwordIV, responseData.authTag, reqBody.userLoginItemID);

                if (q === '') callback({ "code": "NO_CHANGE" }, null);
                else {
                    con.query(q, values, async (err, result) => {
                        if (err) callback(err, null);
                        else callback(null, result);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error.message);
                callback(error, null);
            });
    }
};


const patchLoginItemFavorite = function (reqBody, callback) {
    if (reqBody.loginItemID === undefined) {
        callback({ "code": "NO_ID" }, null);
    }
    else {

        const values = []
        let q = `UPDATE UserLoginItems SET favorited = ? WHERE userLoginItemID = ?`;

        values.push(reqBody.favorite, reqBody.loginItemID)
        con.query(q, values, (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else callback(null, result);
        });
    }
}


const nullSessionID = function (reqBody, callback) {
    if (reqBody.userID === undefined) {
        callback({ "code": "NO_ID" }, null);
        return; // Exit the function if no userID is provided
    }

    let q = `UPDATE Users SET userSessionID = NULL WHERE userID = ?`;
    con.query(q, [reqBody.userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}



const patchNote = async function (userID, reqBody, callback) {
    if (reqBody.noteID === undefined) {
        callback({ "code": "NO_ID" }, null);
    } else {
        let noteTitle = reqBody.title;
        let noteText = reqBody.text;
        let noteCreatedDate = formattedDate;
        let noteUpdatedDate = formattedDate;
        let noteAccessedDate = formattedDate;
        const userHash = await getUserHash(userID);
        const userSalt = await getUserSalt(userID);

        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        let responseData; // Variable to store the JSON response

        await fetch('https://127.0.0.1:8002/ciphertext', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                noteTitle,
                noteText,
                noteCreatedDate,
                noteUpdatedDate,
                noteAccessedDate,
                userID,
                userHash,
                userSalt
            }),
            agent, // Include the custom agent here
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                responseData = data;
                console.log("data is", data);

                let q = `UPDATE UserNotes SET`;

                const values = [];
                if (reqBody.title !== undefined) {
                    q += ` userNoteTitle = ?,`;
                    values.push(responseData.encryptedTitleData);
                }

                if (reqBody.text !== undefined) {
                    q += ` userNoteText = ?,`;
                    values.push(responseData.encryptedNoteData);
                }

                q += ` userNoteAccessed = ?,`;
                q += ` userNoteUpdated = ?,`;
                q += ` userNoteIV = ?,`;
                q += ` userNoteTextIV = ?,`;
                q += ` authTag = ?`;

                q += ` WHERE userNoteID = ?`;

                values.push(formattedDate, formattedDate, responseData.iv, responseData.userNoteTextIV, responseData.authTag, reqBody.noteID);

                console.log(q)
                con.query(q, values, (err, result) => {
                    if (err) callback(err, null);
                    else callback(null, result);
                });
            })
            .catch(error => {
                console.error('Error:', error.message);
                callback(error, null);
            });
    }
};

const patchNoteFavorite = function (reqBody, callback) {
    if (reqBody.noteID === undefined) {
        callback({ "code": "NO_ID" }, null);
    } else {
        let q = `UPDATE UserNotes SET favorited = ? WHERE userNoteID = ?`;
        const values = [reqBody.favorite, reqBody.noteID];

        con.query(q, values, (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }
};






// DELETE (DELETE) MODEL FUNCTIONS  *****************************************

const deleteUser = function (userId, callback) {
    let q = `DELETE FROM Users WHERE userID = ?`;
    con.query(q, [userId], (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

const deleteUserLoginItem = function (userLoginItemId, callback) {
    let q = `DELETE FROM UserLoginItems WHERE userLoginItemID = ?`;
    con.query(q, [userLoginItemId], (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

const deleteNote = function (userNoteId, callback) {
    let q = `DELETE FROM UserNotes WHERE userNoteID = ?`;
    con.query(q, [userNoteId], (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}




// Exports for application-controller
export {
    createUser, createUserLoginItem, createUserNote,
    getUserByUsername, getUserByEmail,
    getSingleUserLoginItems, getUserLoginItemByUsername, getUserLoginItemByWebsite, getSingleUserLoginItemsFavorites,
    getSingleUserNotes, getUserNoteByTitle, getSingleUserNotesFavorites,
    patchUser, patchLoginItem, patchLoginItemFavorite, patchNote, patchNoteFavorite,
    deleteNote, deleteUserLoginItem, deleteUser, nullSessionID
};
