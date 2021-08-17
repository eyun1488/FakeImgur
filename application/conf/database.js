const mysql = require('mysql2');

// create a pool connection. this will use a sql statement but you have free up the connection afterwards. pool will handle this.
const pool = mysql.createPool({
    connectionLimit: 50,
    host: "localhost",
    user: "root",
    password: "123456",
    database: "csc317db",
    connectionLimit: 50,
    // waitForConnection: true,
    debug: false // error from database to see login and password error
});

// module.exports = pool;

// this will convert our api to promises based connection objects or non-promised space connection objects
const promisePool = pool.promise();
module.exports = promisePool;

