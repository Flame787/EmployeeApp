const sql = require('mssql')
require("dotenv").config();

// configuration for sql-server:

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  options: {
    encrypt: false,    // or true if using Azure sql
	enableArithAbort: true
  },
  port: parseInt(process.env.DB_PORT)
}

// -> here we created a server

// create a connection pool to database and export it as a promise:

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Connected to database");
    return pool;
  })
  .catch(err => {
    console.error("Database connection failed", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};