// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.host,
    user            : process.env.dbuser,
    password        : process.env.dbpassphrase,
    database        : process.env.database
})

// Export it for use in our applicaiton
module.exports.pool = pool;
