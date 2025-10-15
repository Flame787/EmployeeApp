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
  port: parseInt(process.env.DB_PORT)
}

// -> here we created a server

// create a connection pool to database and export it as a promise:

// const poolPromise = new sql.ConnectionPool(config)
const poolPromise = mysql.createPool(config)
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
  poolPromise
};


