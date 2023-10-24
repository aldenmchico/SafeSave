// Import dependencies.
import 'dotenv/config';
import mysql from 'mysql';
import * as db from './db-connector.mjs';

var con = mysql.createConnection(db.dbConfig);

// CREATE (POST) MODEL FUNCTIONS *****************************************

// POST Users Table Model Functions *****************************************
const createUser = function(username, email, password, callback) {
    let q = `INSERT INTO Users (userUsername, userEmail, userPassword) VALUES ("${username}", "${email}", "${password}")`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
}

// POST UserLoginItems Table Model Functions  *****************************************
const createUserLoginItem = function(website, username, password, dateCreated, dateUpdated, dateAccessed, userID, callback) {
    let q = `INSERT INTO UserLoginItems (userLoginItemWebsite, userLoginItemUsername, userLoginItemPassword,
                userLoginItemDateCreated, userLoginItemDateUpdated, userLoginItemDateAccessed, userID) 
                VALUES ("${website}", "${username}", "${password}", "${dateCreated}", "${dateUpdated}", "${dateAccessed}", ${userID})`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
}

// POST UserNotes Table Model Functions  *****************************************
const createUserNote = function(title, text, dateCreated, dateUpdated, dateAccessed, userID, callback) {
    let q = `INSERT INTO UserNotes (userNoteTitle, userNoteText, userNoteCreated,
                userNoteUpdated, userNoteAccessed, userID) 
                VALUES ("${title}", "${text}", "${dateCreated}", "${dateUpdated}", "${dateAccessed}", ${userID})`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
}

// RETRIEVE (GET) MODEL FUNCTIONS *****************************************

// GET Users Table Model Functions  *****************************************

const getAllUsers = function(callback) {
    let q = "SELECT * FROM Users";
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getUserByUsername = function(username, callback) {
    let q = `SELECT * FROM Users WHERE userUsername = '${username}'`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

// GET UserLoginItems Table Model Functions  *****************************************
const getAllLoginItems = function(callback) {
    let q = "SELECT * FROM UserLoginItems";
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getSingleUserLoginItems = function(id, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ${id}`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getUserLoginItemByWebsite = function(id, website, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ${id} AND userLoginItemWebsite = '${website}'`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getUserLoginItemByUsername = function(id, username, callback) {
    let q = `SELECT * FROM UserLoginItems WHERE userID = ${id} AND userLoginItemUsername = '${username}'`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

// GET UserNotes Table Model Functions  *****************************************
const getAllUserNotes = function(callback) {
    let q = "SELECT * FROM UserNotes";
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getSingleUserNotes = function(id, callback) {
    let q = `SELECT * FROM UserNotes WHERE userID = ${id}`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

const getUserNoteByTitle = function(id, title, callback) {
    let q = `SELECT * FROM UserNotes WHERE userID = ${id} AND userNoteTitle = "${title}"`;
    con.query(q, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};


// UPDATE (POST) MODEL FUNCTIONS *****************************************************

/*
const {FUNCTION_NAME} = async (FUNCTION_PARAMS) => {
    pass
};
*/


// DELETE (DELETE) MODEL FUNCTIONS  *****************************************

/*
const {FUNCTION_NAME} = async (FUNCTION_PARAMS) => {
    pass
};
*/


// Exports for application-controller
export {
    createUser, createUserLoginItem, createUserNote,
    getAllUsers, getUserByUsername,
    getAllLoginItems, getSingleUserLoginItems, getUserLoginItemByUsername, getUserLoginItemByWebsite,
    getAllUserNotes, getSingleUserNotes, getUserNoteByTitle   
};