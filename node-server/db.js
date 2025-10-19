// const sql = require('mssql')
const mysql = require("mysql2/promise");
require("dotenv").config();
console.log("DB_USER:", process.env.DB_USER);

// configuration for sql-server:

const config = {
  host: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  //   options: {
  //     encrypt: false,    // or true if using Azure sql
  // 	enableArithAbort: true
  //   },
  port: parseInt(process.env.DB_PORT),
};

// -> here we created a server

// create a connection pool to database and export it as a promise:

// const poolPromise = new sql.ConnectionPool(config)
const poolPromise = mysql.createPool(config);
//   .connect()
//   .then(pool => {
//     console.log("Connected to database");
//     return pool;
//   })
//   .catch(err => {
//     console.error("Database connection failed", err);
//     throw err;
//   });

module.exports = {
  sql: mysql,
  poolPromise,
};



/* mysql - MySQL client library imported earlier (usually mysql2/promise if you’re using async/await). 
It provides functions to connect and run queries.

createPool(config) - instead of opening a single connection, this is creating a connection pool.

POOL = a collection of reusable connections to the database, they are kep open and ready to use.
When your API gets a request (e.g. GET /api/employees), it borrows a connection from the pool, runs the query, and then releases the connection back to the pool.
This is much more efficient than opening/closing a new connection for every request.
More users can send requests to the database at the same time, pool will handle the connections for all of them simultaneously.

config - already defined earlier; an object with settings for connecting to the database (host, user, password, database name, port, connection limit etc.). */

