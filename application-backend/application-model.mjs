// Import dependencies.
import 'dotenv/config';
import mysql from 'mysql';
import * as db from './db-connector.mjs';

var con = mysql.createConnection(db.dbConfig);

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
    if (reqBody.website === undefined || reqBody.username === undefined || reqBody.password === undefined ||
        reqBody.dateCreated === undefined || reqBody.dateUpdated === undefined || reqBody.dateAccessed === undefined ||
        reqBody.userID === undefined) {
        callback({ "code": "EMPTY_FIELD" }, null);
    }
    else {
        // UPDATE: Need to call encryption microservice here to encrypt data in reqBody before saving to DB.
        // UPDATE: Need to update the SQL query to include the IV values when saving to DB.
        let q = `INSERT INTO UserLoginItems (userLoginItemWebsite, userLoginItemUsername, userLoginItemPassword,
                    userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, userID) 
                    VALUES ("${reqBody.website}", "${reqBody.username}", "${reqBody.password}", 
                    "${reqBody.dateCreated}", "${reqBody.dateUpdated}", "${reqBody.dateAccessed}", ${reqBody.userID})`;
        con.query(q, (err, result) => {
            if (err) callback(err, null);
            else callback(null, result);
        });
    }
}

// POST UserNotes Table Model Functions  *****************************************
const createUserNote = function (reqBody, callback) {
    if (reqBody.title === undefined || reqBody.text === undefined ||
        reqBody.dateCreated === undefined || reqBody.dateUpdated === undefined || reqBody.dateAccessed === undefined ||
        reqBody.userID === undefined) {
        callback({ "code": "EMPTY_FIELD" }, null);
    }
    else {
        // UPDATE: Need to call encryption microservice here to encrypt data in reqBody before saving to DB.
        // UPDATE: Need to update the SQL query to include the IV values when saving to DB.
        let q = `INSERT INTO UserNotes (userNoteTitle, userNoteText, userNoteCreated,
            userNoteUpdated, userNoteAccessed, userID) 
            VALUES ("${reqBody.title}", "${reqBody.text}", "${reqBody.dateCreated}", 
            "${reqBody.dateUpdated}", "${reqBody.dateAccessed}", ${reqBody.userID})`;
        con.query(q, (err, result) => {
            if (err) callback(err, null);
            else callback(null, result);
        });
    }

}

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
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
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
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

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
        // Additional fields for user2FAEnabled
        if (reqBody.user2FAEnabled !== undefined) {
            q += `UPDATE Users SET user2FAEnabled = "${reqBody.user2FAEnabled}" WHERE userID = ${reqBody.userID}; `;
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
    if (reqBody.loginItemID === undefined || reqBody.userID === undefined) {
        callback({ "code": "NO_ID" }, null);
    }
    else {
        let q = '';
        // UPDATE: Need to call encryption microservice here to encrypt data before saving to DB.
        // UPDATE: Need to update the SQL query to include the IV values when saving to DB.
        if (reqBody.website !== undefined) q = `UPDATE UserLoginItems SET userLoginItemWebsite = "${reqBody.website}" WHERE userID = ${reqBody.userID}; `;
        if (reqBody.username !== undefined) q += `UPDATE UserLoginItems SET userLoginItemUsername = "${reqBody.username}" WHERE userID = ${reqBody.userID}; `;
        if (reqBody.password !== undefined) q += `UPDATE UserLoginItems SET userLoginItemPassword = "${reqBody.password}" WHERE userID = ${reqBody.userID}; `;
        if (reqBody.dateUpdated !== undefined) q += `UPDATE UserLoginItems SET userLoginItemDateUpdated = "${reqBody.dateUpdated}" WHERE userID = ${reqBody.userID}; `;
        if (reqBody.dateAccessed !== undefined) q += `UPDATE UserLoginItems SET userLoginItemDateAccessed = "${reqBody.dateAccessed}" WHERE userID = ${reqBody.userID}; `;
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

const patchNote = function (reqBody, callback) {
    if (reqBody.userNoteID === undefined || reqBody.userID === undefined) {
        callback({ "code": "NO_ID" }, null);
    }
    else {
        let q = '';
        // UPDATE: Need to call encryption microservice here to encrypt data before saving to DB.
        // UPDATE: Need to update the SQL query to include the IV values when saving to DB.
        if (reqBody.title !== undefined) q = `UPDATE UserNotes SET userNoteTitle = "${reqBody.title}" WHERE userID = ${reqBody.userID}; `;
        if (reqBody.text !== undefined) q += `UPDATE UserNotes SET userNoteText = "${reqBody.text}" WHERE userID = ${reqBody.userID}; `;
        if (reqBody.dateUpdated !== undefined) q += `UPDATE UserNotes SET userNoteUpdated = "${reqBody.dateUpdated}" WHERE userID = ${reqBody.userID}; `;
        if (reqBody.dateAccessed !== undefined) q += `UPDATE UserNotes SET userNoteAccessed = "${reqBody.dateAccessed}" WHERE userID = ${reqBody.userID}; `;
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


// DELETE (DELETE) MODEL FUNCTIONS  *****************************************

const deleteUser = function (userId, callback) {
    let q = `DELETE FROM Users WHERE userID = ${userId}`;
    con.query(q, (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

const deleteUserLoginItem = function (userId, userLoginItemId, callback) {
    let q = `DELETE FROM UserLoginItems WHERE userID = ${userId} AND userLoginItemID = ${userLoginItemId}`;
    con.query(q, (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

const deleteNote = function (userId, userNoteId, callback) {
    let q = `DELETE FROM UserNotes WHERE userID = ${userId} AND userNoteID = ${userNoteId}`;
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
    patchUser, patchLoginItem, patchNote,
    deleteNote, deleteUserLoginItem, deleteUser
};