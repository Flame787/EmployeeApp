const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {sql, poolPromise} = require("./db.js");

const app = express(); 
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`));


// for test in terminalu: node server.js - when started, should write 'Server is running on port...'

// creating 1st API: get all employee records

app.get("/api/employees", async(req, res) => {
   try{
     // create pull object:
     const pool = await poolPromise;
	 const [rows] = await pool.query(
        "SELECT * FROM DummyEmployees");
	 console.log(rows);
	 res.status(200).json({
	    success: true,
		empData: rows     // empData = employee data
	 })
   }
   
   catch(error){
    console.log("Error", error);
	res.status(500).json({
	    success: false,
		message: "Server error, try again",
		error: error.message
	 })
   }
});