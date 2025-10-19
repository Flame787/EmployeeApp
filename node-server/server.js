const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sql, poolPromise } = require("./db.js");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// for test in terminalu: node server.js - when started, should write 'Server is running on port...'

// creating 1st API: get all employee records

app.get("/api/employees", async (req, res) => {
  // Route definition: This creates a GET endpoint at /api/employees.
  try {
    // Error handling start: Begins a try block. If anything inside fails, execution will jump to the catch block.
    // create pull object:
    const pool = await poolPromise; // Database connection: Waits for the database connection pool (from db.js) to be ready.
    // A pool manages multiple connections efficiently, so you don’t open a new connection for every request.
    const [rows] = await pool.query("SELECT * FROM DummyEmployees"); // SQL query: Executes a query to fetch all rows from the DummyEmployees table.

    console.log(rows); // Debug log: Prints the retrieved rows to the server console.
    res.status(200).json({
      // Success response: Sends back an HTTP 200 (OK) status with a JSON object.
      success: true,
      empData: rows, // empData = employee data; array of employees retrieved from the database.
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      // Error response: Sends back HTTP 500 (Internal Server Error) with a JSON object.
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

// Check if 1. API works: http://localhost:5000/api/employees - should return all employees in JSON format

// create 2. API: get an employee by ID

app.get("/api/employees/:id", async (req, res) => {
  // Defines a GET endpoint at /api/employees/:id, where :id is a dynamic URL parameter.
  try {
    const { id } = req.params; // Error boundary: Starts a try block to catch any runtime errors and handle them.
    // Extract params: Pulls id from the URL parameters (e.g. /api/employees/5 → id = "5").
    if (isNaN(id)) {
      return res.status(400).json({
        // Validation: ID should be a number. If ID is 'Not a Number' (NaN) -> invalid (e.g. "abc" - string), immediately returns a 400 Bad Request.
        success: false,
        message: "Invalid ID", // Early return: Stops execution here if the id is invalid.
      });
    }

    const pool = await poolPromise; // Get connection pool: Waits for the database pool to be ready (from your db.js). This gives you a pooled connection for efficient queries.
    // const result = await pool
    //   .request()
    //   .input("EmployeeID", sql.Int, id) // Prepared statement: Safely injects the id into the SQL query to prevent SQL injection attacks.
    //   .query("SELECT * FROM DummyEmployees WHERE EmployeeID = @EmpployeeID"); // SQL query: Selects all columns from DummyEmployees
    // console.log(result);
    const [rows] = await pool.query(
      "SELECT * FROM DummyEmployees WHERE EmployeeID = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee details not found",
      });
    }

    // if (result.recordset.length === 0) {
    //   // recordset = set of rows returned by the query
    //   return res.status(404).json({
    //     // Not found: If the query returns no rows, the employee doesn’t exist. Returns 404 Not Found
    //     success: false,
    //     message: "Employee details not found",
    //   });
    // }

    // res.status(200).json({
    //   // Success response: If a row exists, return 200 OK with the first (and only) matching employee’s data.
    //   success: true,
    //   empData: result.recordset[0], // returns the first employee object from the recordset array
    // });

    // ** MySQL (mysql2/promise): const [rows] = await pool.query("SELECT ...", [params]);
    // ** MSSQL (mssql): const result = await pool.request().input(...).query("SELECT ...");

    res.status(200).json({
      success: true,
      empData: rows[0],
    });
  } catch (error) {
    // Error handling: Catches unexpected errors (DB issues, code bugs), logs them, and returns 500 Internal Server Error with a generic message.
    console.log("Error", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

// Check if 2. API works: http://localhost:5000/api/employees/1 OR http://localhost:5000/api/employees/2 - should return employee with ID 1 or 2 in JSON format

// create 3. API: add a new employee (POST)
