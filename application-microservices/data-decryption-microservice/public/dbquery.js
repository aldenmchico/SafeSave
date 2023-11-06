const db = require( "../db-connector.cjs")

const dbQuery = `SELECT * FROM UserNotes`;

db.pool.query(dbQuery, function(error, notes, fields){
    if (error){
        console.log(error)
        return;
    }
    else{
        console.log(notes)
    }
})