import { createPool } from 'mysql';
 
// Create a 'connection pool' using the provided credentials
var pool = createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'DemoDatabasePassword!!123',
    database: 'capstone_2023_securepass1'
})
 
export { pool };
