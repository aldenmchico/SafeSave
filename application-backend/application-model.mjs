// Import dependencies.
import 'dotenv/config';
import mysql from 'mysql';
import * as db from './db-connector.mjs';
var con = mysql.createConnection(db.dbConfig);

import fetch from 'node-fetch';
import https from 'https';

// CREATE (POST) MODEL FUNCTIONS *****************************************

// POST Users Table Model Functions *****************************************
const createUser = function (reqBody, callback) {
    if (reqBody.username === undefined || reqBody.email === undefined || reqBody.password === undefined) {
        callback({ "code": "EMPTY_FIELD" }, null);
    }
    else {
        let q = `INSERT INTO Users (userUsername, userEmail, userPassword) VALUES ("${reqBody.username}", "${reqBody.email}", "${reqBody.password}")`;
        con.query(q, (err, result) => {
            if (err) callback(err, null);
            else callback(null, result);
        });
    }
}

// POST UserLoginItems Table Model Functions  *****************************************
const createUserLoginItem = function (reqBody, callback) {

    // if (reqBody.website === undefined || reqBody.username === undefined || reqBody.password === undefined ||
    //     reqBody.dateCreated === undefined || reqBody.dateUpdated === undefined || reqBody.dateAccessed === undefined ||
    //     reqBody.userID === undefined) {
    //     callback({ "code": "EMPTY_FIELD" }, null);
    // }
    // else {

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day;

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    let responseData;
    var userLoginWebsite = reqBody.website;
    var userLoginUsername = reqBody.username;
    var userLoginPassword = reqBody.password;
    var userHash = "pass1";


    fetch('https://127.0.0.1:8002/ciphertext', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userLoginWebsite,
            userLoginUsername,
            userLoginPassword,
            userHash
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

            //TODO: HARDCODED USER VALUE NEEDS TO BE FIXED
            let q = `INSERT INTO UserLoginItems (userLoginItemWebsite, userLoginItemUsername, userLoginItemPassword,
                    userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, userID, websiteIV, usernameIV, passwordIV, authTag)
          VALUES ("${responseData.encryptedWebsite}", "${responseData.encryptedUsername}", 
          "${responseData.encryptedPassword}", 
          '${formattedDate}', '${formattedDate}', '${formattedDate}', 1, "${responseData.websiteIV}", "${responseData.usernameIV}", "${responseData.passwordIV}", "${responseData.authTag}")`;

            con.query(q, (err, result) => {
                if (err) callback(err, null);
                else callback(null, result);
            });
        })
        .catch(error => {
            console.error('Error:', error.message);
            callback(error, null);
        });
};




// POST UserNotes Table Model Functions  *****************************************

const createUserNote = function (reqBody, callback) {

    //     // if (reqBody.title === undefined || reqBody.text === undefined ||
//     //     reqBody.dateCreated === undefined || reqBody.dateUpdated === undefined || reqBody.dateAccessed === undefined ||
//     //     reqBody.userID === undefined) {
//     //     callback({ "code": "EMPTY_FIELD" }, null);
//     // }
//     // else {
//
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day;

    let noteTitle = reqBody.title;
    let noteText = reqBody.content;
    let noteCreatedDate = formattedDate;
    let noteUpdatedDate = formattedDate;
    let noteAccessedDate = formattedDate;
    let userID = 1;
    let userHash = "pass1";

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    let responseData; // Variable to store the JSON response

    fetch('https://127.0.0.1:8002/ciphertext', {
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

            //TODO: HARDCODED USER VALUE NEEDS TO BE FIXED
            let q = `INSERT INTO UserNotes (userNoteTitle, userNoteText, userNoteCreated,
          userNoteUpdated, userNoteAccessed, userID, userNoteIV, userNoteTextIV, authTag) 
          VALUES ("${responseData.encryptedTitleData}", "${responseData.encryptedNoteData}", 
          '${formattedDate}', '${formattedDate}', '${formattedDate}', 1, "${responseData.iv}", "${responseData.userNoteTextIV}", "${responseData.authTag}")`;

            con.query(q, (err, result) => {
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
const getUserByEmail = function (email, callback) {
    let q = `SELECT * FROM Users WHERE userEmail = ${mysql.escape(email)}`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};


const getAllUsers = function (callback) {
    let q = "SELECT * FROM Users";
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getUserByUsername = function (username, callback) {
    let q = `SELECT * FROM Users WHERE userUsername = '${username}'`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

// GET UserLoginItems Table Model Functions  *****************************************
const getAllLoginItems = function (callback) {
    let q = "SELECT * FROM UserLoginItems";
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getSingleUserLoginItems = function (id, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ${id}`;
    con.query(q, async (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        try{
            const decryptedResult = await Promise.all(result.map(decryptRowData));
            callback(null, decryptedResult);
        } catch (error){
            callback(error)
        }
    });
};

const getUserLoginItemByWebsite = function (id, website, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ${id} AND userLoginItemWebsite = '${website}'`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getUserLoginItemByUsername = function (id, username, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ${id} AND userLoginItemUsername = '${username}'`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

// GET UserNotes Table Model Functions  *****************************************
const getAllUserNotes = function (callback) {
    let q = "SELECT * FROM UserNotes";
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getSingleUserNotes = function (id, callback) {
    let q = `SELECT * FROM UserNotes WHERE userID = ${id}`;
    con.query(q, async (err, result) => {
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
        let userHash = "userHash";
        encryptedData[userHash] = "pass1";

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
    let q = `SELECT * FROM UserNotes WHERE userID = ${id} AND userNoteTitle = "${title}"`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};


// UPDATE (PATCH) MODEL FUNCTIONS *****************************************************

const patchUser = function (reqBody, callback) {
    if (reqBody.userID === undefined) {
        callback({ "code": "NO_USER_ID" }, null);
    }
    else {
        let q = '';
        if (reqBody.email !== undefined) {
            q = `UPDATE Users SET userEmail = "${reqBody.email}" WHERE userID = ${reqBody.userID}; `;
        }
        if (reqBody.password !== undefined) {
            q += `UPDATE Users SET userPassword = "${reqBody.password}" WHERE userID = ${reqBody.userID}; `;
        }
        // Additional fields for userSecret and userTempSecret
        if (reqBody.userSecret !== undefined) {
            q += `UPDATE Users SET userSecret = "${reqBody.userSecret}" WHERE userID = ${reqBody.userID}; `;
        }
        if (reqBody.userTempSecret !== undefined) {
            // If userTempSecret is explicitly set to null, construct the SQL without quotes
            const tempSecretValue = reqBody.userTempSecret === null ? 'NULL' : `"${reqBody.userTempSecret}"`;
            q += `UPDATE Users SET userTempSecret = ${tempSecretValue} WHERE userID = ${reqBody.userID}; `;
        }
        if (q === '') callback({ "code": "NO_CHANGE" }, null)
        else {
            con.query(q, (err, result) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                }
                else callback(null, result);
            });
        }
    }
}

const patchLoginItem = function (reqBody, callback) {
    if (reqBody.loginItemID === undefined) {
        callback({ "code": "NO_ID" }, null);
    }
    else {
        let q = '';
        // UPDATE: Need to call encryption microservice here to encrypt data before saving to DB.
        // UPDATE: Need to update the SQL query to include the IV values when saving to DB.
        if (reqBody.website !== undefined) q = `UPDATE UserLoginItems SET userLoginItemWebsite = "${reqBody.website}" WHERE userLoginItemID = ${reqBody.loginItemID}; `;
        if (reqBody.username !== undefined) q += `UPDATE UserLoginItems SET userLoginItemUsername = "${reqBody.username}" WHERE userLoginItemID = ${reqBody.loginItemID}; `;
        if (reqBody.password !== undefined) q += `UPDATE UserLoginItems SET userLoginItemPassword = "${reqBody.password}" WHERE userLoginItemID = ${reqBody.loginItemID}; `;
        if (reqBody.dateUpdated !== undefined) q += `UPDATE UserLoginItems SET userLoginItemDateUpdated = "${reqBody.dateUpdated}" WHERE userLoginItemID = ${reqBody.loginItemID}; `;
        if (reqBody.dateAccessed !== undefined) q += `UPDATE UserLoginItems SET userLoginItemDateAccessed = "${reqBody.dateAccessed}" WHERE userLoginItemID = ${reqBody.loginItemID}; `;
        if (q === '') callback({ "code": "NO_CHANGE" }, null)
        else {
            con.query(q, (err, result) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                }
                else callback(null, result);
            });
        }
    }
}

const patchLoginItemFavorite = function(reqBody, callback) {
    if (reqBody.loginItemID === undefined) {
        callback({ "code": "NO_ID" }, null);
    }
    else {
        let q = `UPDATE UserLoginItems SET favorited = "${reqBody.favorite}" WHERE userLoginItemID = ${reqBody.loginItemID}; `;
        con.query(q, (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else callback(null, result);
        });
    }
}

const patchNote = function (reqBody, callback) {
    if (reqBody.noteID === undefined) {
        callback({ "code": "NO_ID" }, null);
    }
    else {
        let q = '';
        // UPDATE: Need to call encryption microservice here to encrypt data before saving to DB.
        // UPDATE: Need to update the SQL query to include the IV values when saving to DB.
        if (reqBody.title !== undefined) q = `UPDATE UserNotes SET userNoteTitle = "${reqBody.title}" WHERE userNoteID = ${reqBody.noteID}; `;
        if (reqBody.text !== undefined) q += `UPDATE UserNotes SET userNoteText = "${reqBody.text}" WHERE userNoteID = ${reqBody.noteID}; `;
        if (reqBody.dateUpdated !== undefined) q += `UPDATE UserNotes SET userNoteUpdated = "${reqBody.dateUpdated}" WHERE userNoteID = ${reqBody.noteID}; `;
        if (reqBody.dateAccessed !== undefined) q += `UPDATE UserNotes SET userNoteAccessed = "${reqBody.dateAccessed}" WHERE userNoteID = ${reqBody.noteID}; `;
        if (q === '') callback({ "code": "NO_CHANGE" }, null)
        else {
            con.query(q, (err, result) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                }
                else callback(null, result);
            });
        }
    }
}

const patchNoteFavorite = function(reqBody, callback) {
    if (reqBody.noteID === undefined) {
        callback({ "code": "NO_ID" }, null);
    }
    else {
        let q = `UPDATE UserNotes SET favorited = "${reqBody.favorite}" WHERE userNoteID = ${reqBody.noteID}; `;
        con.query(q, (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else callback(null, result);
        });
    }
}


// DELETE (DELETE) MODEL FUNCTIONS  *****************************************

const deleteUser = function (userId, callback) {
    let q = `DELETE FROM Users WHERE userID = ${userId}`;
    con.query(q, (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

const deleteUserLoginItem = function (userLoginItemId, callback) {
    let q = `DELETE FROM UserLoginItems WHERE userLoginItemID = ${userLoginItemId}`;
    con.query(q, (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

const deleteNote = function (userNoteId, callback) {
    let q = `DELETE FROM UserNotes WHERE userNoteID = ${userNoteId}`;
    con.query(q, (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}


// Exports for application-controller
export {
    createUser, createUserLoginItem, createUserNote,
    getAllUsers, getUserByUsername, getUserByEmail,
    getAllLoginItems, getSingleUserLoginItems, getUserLoginItemByUsername, getUserLoginItemByWebsite,
    getAllUserNotes, getSingleUserNotes, getUserNoteByTitle,
    patchUser, patchLoginItem, patchLoginItemFavorite, patchNote, patchNoteFavorite,
    deleteNote, deleteUserLoginItem, deleteUser
};