import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // React-Toastify allows to add notifications to the app with ease
import "react-toastify/dist/ReactToastify.css"; // Importing React-Toastify CSS for default styling
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS for default styling

const EmployeeCrud = () => {
  const [employees, setEmployees] = useState([]); // State to hold the list of employees (array of employee objects)
  const [employee, setEmployee] = useState({
    // State for the current employee data - uses an object for multiple fields
    EmployeeName: "", // initial values are empty strings
    MobileNumber: "",
    Department: "",
    Salary: "",
  }); // State to hold the current employee data

  const [isEditing, setIsEditing] = useState(false); // State to track if we are in editing mode
  const [EmployeeID, setEmployeeID] = useState(null); // State for the ID of the employee being edited

  const API_URL = "http://localhost:5000/api/employees"; // URL for the API

  useEffect(() => {
    fetchEmployees();  // Fetch employees when the component mounts
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response);
      setEmployees(response.data.empData);      // fill the employees state with data from the response
    //   setEmployeeID(response.data.empData.EmployeeID);  // not needed here
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const editEmployee = async (EmployeeID) => {    // fetch existing employee data by ID
  try {
    const response = await axios.get(`${API_URL}/${EmployeeID}`);  // GET request to fetch employee data by ID
    console.log(response);
    setEmployee(response.data.empData); // fill the form with existing data
    setEmployeeID(EmployeeID);   // set the EmployeeID state to the ID being edited
    setIsEditing(true); 
  } catch (error) {
    console.error("Error fetching employee data:", error);
  }
};

  const deleteEmployee = async (id) => {   // delete employee by ID
    if (window.confirm("Are you sure you want to delete this employee?")) {   
      try {
        await axios.delete(`${API_URL}/${id}`);   // DELETE request, to delete employee by ID
        toast.success("Employee deleted successfully.");   // show success notification
        fetchEmployees();            // refresh the employees list
      } catch (error) {
        toast.error("Error deleting employee:", error);
      }
    }
  };

  const handleInputChange = (e) => {    // handle changes in the form inputs
    const { name, value } = e.target;   // get the name and value of the changed input
    setEmployee({ ...employee, [name]: value });   // update the employee state with the new value, using spread operator to keep other fields unchanged
  };

  const handleAddAndUpdate = async () => {   // handle both adding and updating employee
    try {
      if (isEditing) {           // if in editing mode, update existing employee
        await axios.put(`${API_URL}/${EmployeeID}`, employee);  // PUT request to update employee by ID
        toast.success("Employee updated successfully.");   
      } else {
        await axios.post(API_URL, employee);       // else, add new employee with POST request
        toast.success("Employee added successfully.");
      }
      fetchEmployees();   // refresh the employees list
      setIsEditing(false);   // reset editing mode
      setEmployee({    // clear the form
        EmployeeName: "",
        MobileNumber: "",
        Department: "",
        Salary: "",
      });
    } catch (error) {
      console.log("Error adding/updating employee:", error);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />   {/* Container for displaying toast notifications */}
      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#employeeModal"
        onClick={() => setIsEditing(false)}
      >
        Add new employee
      </button>
      <h1>Employees List</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Mobile Number</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.EmployeeID}>
              <td>{emp.EmployeeName}</td>
              <td>{emp.MobileNumber}</td>
              <td>{emp.Department}</td>
              <td>{emp.Salary}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#employeeModal"
                  onClick={() => editEmployee(emp.EmployeeID)}
                >
                  EDIT
                </button>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => deleteEmployee(emp.EmployeeID)}
                >
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for adding/editing employee would go here */}
      <div
        className="modal fade"
        id="employeeModal"
        tabIndex="-1"
        aria-labelledby="employeeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="employeeModalLabel">
                {isEditing ? "Edit employee" : "Add new employee"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="EmployeeName"
                placeholder="Enter name"
                className="form-control mb-3"
                value={employee.EmployeeName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="MobileNumber"
                placeholder="Enter mobile number"
                className="form-control mb-3"
                value={employee.MobileNumber}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="Department"
                placeholder="Enter department"
                className="form-control mb-3"
                value={employee.Department}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="Salary"
                placeholder="Enter salary"
                className="form-control mb-3"
                value={employee.Salary}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddAndUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCrud;

// To start the frontend server:
// 1. Open a terminal and navigate to the 'employee-crud-ui' directory: ...EmployeeApp/employee-crud-ui
// 2. Use the command: npm start

// To start the backend server:
// 1. Open a terminal and navigate to the 'node-server' directory: ...EmployeeApp/node-server
// 2. Use the command: node server.js

// The backend server runs on port 5000 by default, and the frontend server runs on port 3000 by default.
// Make sure both servers are running.
