// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'HOST NAME',
    user: 'USER NAME',
    password: 'PASSWORD',
    database: 'DATABASE NAME'
})

// Export it for use in our applicaiton
module.exports.pool = pool;