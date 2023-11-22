import { createPool } from 'mysql';
 
// Create a 'connection pool' using the provided credentials
var pool = createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'capstone_2023_securepass1',
    password: 'zxob8b@T8!yF',
    database: 'capstone_2023_securepass1'
})
 
export { pool };
