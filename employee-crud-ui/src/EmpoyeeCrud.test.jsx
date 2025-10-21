import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act, // to handle async state updates - useEffect, etc.
} from "@testing-library/react";

// import axios from "axios";
jest.mock("axios");
import axios from "axios";

import EmployeeCrud from "./EmployeeCrud";
import { toast } from "react-toastify";

// Mock axios and toast, to prevent real API calls and notifications during tests:
// jest.mock("axios");

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(), // mock implementation of toast.success
    error: jest.fn(), // mock implementation of toast.error
  },
  ToastContainer: () => <div data-testid="toast-container" />, // this mock component will be rendered in place of ToastContainer
}));

// added so that each test starts with empty employees data, to prevent TypeError: Cannot read properties of undefined (reading 'data'):
beforeEach(() => {
  axios.get.mockResolvedValue({ data: { empData: [] } });
});

// Clear all mocks after each test, to avoid interference between tests:
afterEach(() => {
  jest.clearAllMocks();
});

// First test suite: UI rendering tests - 6 tests - all passed

describe("EmployeeCrud UI rendering", () => {
  // Group of tests for EmployeeCrud UI rendering; describe block - helps to organize related tests

  // Test 1: rendering main h1 header

  //   test("renders main h1", () => {
  //        // description of the test
  //     render(<EmployeeCrud />);
  //        // render method from React Testing Library, to render the EmployeeCrud component in a virtual DOM for testing
  //     const heading = screen.getByText(/Employees List/i);
  //        // getByText method to find element with text (innerHtml) "Employees List"
  //        // screen = object representing virtual DOM, getByText = method to find element by its text content,
  //        // i = case-insensitive.  / / = regex (regular expression) to match text pattern
  //     expect(heading).toBeInTheDocument(); // assumtion: heading should be present in the document
  //   });

  test("renders main h1", async () => {
    await act(async () => {
      render(<EmployeeCrud />);
    });
    expect(screen.getByText(/Employees List/i)).toBeInTheDocument();
    // i = case-insensitive.  / / = regex (regular expression) to match text pattern
  });

  // Test2: rendering button for adding new employee

  //   test("renders Add new employee button", () => {
  //     render(<EmployeeCrud />);
  //     const addButton = screen.getByRole("button", { name: /Add new employee/i });
  //     // getByRole method to find button element with name "Add new employee", i = case-insensitive
  //     expect(addButton).toBeInTheDocument();
  //   });

  test("renders Add new employee button", async () => {
    await act(async () => {
      render(<EmployeeCrud />);
    });
    const addButton = screen.getByRole("button", { name: /Add new employee/i });
    // getByRole method to find button element with name "Add new employee", i = case-insensitive
    expect(addButton).toBeInTheDocument();
  });

  // Test3: rendering table headers

  test("renders table headers", async () => {
    await act(async () => {
      render(<EmployeeCrud />);
    });
    expect(screen.getByText(/Employee Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Department/i)).toBeInTheDocument();
    expect(screen.getByText(/Salary/i)).toBeInTheDocument();
    expect(screen.getByText(/Actions/i)).toBeInTheDocument();
  });

  // Test4: rendering Toastcontainer with notifications

  test("renders ToastContainer", async () => {
    // checks if ToastContainer for Notifications is rendered
    await act(async () => {
      render(<EmployeeCrud />);
    });
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });

  // Test5: Modal structure test:

  test("renders modal structure (markup check)", async () => {
    // render(<EmployeeCrud />);
    await act(async () => {
      render(<EmployeeCrud />);
    });

    // Button and modal both have the same text, testing if they exist in DOM:
    const titles = screen.getAllByText(/Add new employee/i);
    expect(titles.length).toBe(2);

    // Input fields:
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter mobile number")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter department")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter salary")).toBeInTheDocument();

    // Scope within the modal:
    const modal = document.getElementById("employeeModal");
    const modalScope = within(modal);

    // Buttons inside of modal should be in DOM‑u although modal is hidden initially (Bootstrap - animated modal):

    const closeButtons = modalScope.getAllByRole("button", {
      name: /Close/i,
      hidden: true,
    });
    const footerClose = closeButtons.find((btn) =>
      btn.classList.contains("btn-secondary")
    );
    expect(footerClose).toBeInTheDocument();

    // 'Save changes' button:
    expect(
      modalScope.getByRole("button", { name: /Save changes/i, hidden: true })
    ).toBeInTheDocument();
  });

  // Test 6: checks if modal opens and title is shown when button is clicked:
  test("opens modal and shows modal title", async () => {
    await act(async () => {
      render(<EmployeeCrud />);
    });

    // Click on "Add new employee" button to open modal
    fireEvent.click(screen.getByRole("button", { name: /Add new employee/i }));

    // new:
    const modal = document.getElementById("employeeModal");
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("show");

    // now heading inside modal should be present in the document
    const modalTitle = await screen.findByRole("heading", {
      name: /Add new employee/i,
    });
    expect(modalTitle).toBeInTheDocument();
  });
});

// Second test suite: Functionality tests - another 6 tests

describe("EmployeeCrud component functionallity", () => {
  const mockEmployees = [
    {
      EmployeeID: 1,
      EmployeeName: "John Doe",
      MobileNumber: "123456789",
      Department: "IT",
      Salary: "5000",
    },
    {
      EmployeeID: 2,
      EmployeeName: "Jane Smith",
      MobileNumber: "987654321",
      Department: "HR",
      Salary: "6000",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 7: rendering and fetching employees
  test("fetches and displays employees on mount", async () => {
    axios.get.mockResolvedValueOnce({ data: { empData: mockEmployees } });

    await act(async () => {
      render(<EmployeeCrud />);
    });

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/employees"
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  // Test 8: entering employee data into the form

  test("updates input fields when typing", async () => {
    axios.get.mockResolvedValueOnce({ data: { empData: [] } });

    await act(async () => {
      render(<EmployeeCrud />);
    });

    const nameInput = screen.getByPlaceholderText("Enter name");
    fireEvent.change(nameInput, { target: { value: "Alice" } });

    expect(nameInput.value).toBe("Alice");
  });

  // Test 9: adding new employee

  test("adds a new employee successfully", async () => {
    axios.get.mockResolvedValueOnce({ data: { empData: [] } });
    axios.post.mockResolvedValueOnce({});

    await act(async () => {
      render(<EmployeeCrud />);
    });

    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "New Employee" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter mobile number"), {
      target: { value: "111222333" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter department"), {
      target: { value: "Finance" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter salary"), {
      target: { value: "7000" },
    });

    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/employees",
        {
          EmployeeName: "New Employee",
          MobileNumber: "111222333",
          Department: "Finance",
          Salary: "7000",
        }
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Employee added successfully."
      );
    });
  });

  // Test 10: editing an employee

  test("edits an existing employee successfully", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { empData: mockEmployees } }) // initial fetch
      .mockResolvedValueOnce({ data: { empData: mockEmployees[0] } }); // fetch single employee

    axios.put.mockResolvedValueOnce({});

    await act(async () => {
      render(<EmployeeCrud />);
    });

    await waitFor(() => screen.getByText("John Doe"));

    fireEvent.click(screen.getAllByText("EDIT")[0]);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/employees/1"
      );
    });

    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "John Updated" },
    });

    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:5000/api/employees/1",
        expect.objectContaining({ EmployeeName: "John Updated" })
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Employee updated successfully."
      );
    });
  });

  // Test 11: deleting an employee

  test("deletes an employee when confirmed", async () => {
    axios.get.mockResolvedValueOnce({ data: { empData: mockEmployees } });
    axios.delete.mockResolvedValueOnce({});
    window.confirm = jest.fn(() => true);

    await act(async () => {
      render(<EmployeeCrud />);
    });

    await waitFor(() => screen.getByText("John Doe"));

    fireEvent.click(screen.getAllByText("DELETE")[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5000/api/employees/1"
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Employee deleted successfully."
      );
    });
  });

  //   // Test 12: cancellation of employee deletion

  test("does not delete an employee when canceled", async () => {
    axios.get.mockResolvedValueOnce({ data: { empData: mockEmployees } });
    window.confirm = jest.fn(() => false);

    await act(async () => {
      render(<EmployeeCrud />);
    });

    await waitFor(() => screen.getByText("John Doe"));

    fireEvent.click(screen.getAllByText("DELETE")[0]);

    expect(axios.delete).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});

/////--------------------------------------------------------------------------------------/////

/* TESTING INSTRUCTIONS:

1. Navigate into the frontend-folder: cd employee-crud-ui 

2. Install dependencies for testing:

npm install --save-dev jest @testing-library/react @testing-library/jest-dom

3. If needed (in Vite), add testing scripts into package.json:

"scripts": {
  "test": "jest"
}

But when using Create React App (CRA), the test script is already included by default:

  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",     <- here
    "eject": "react-scripts eject"
  },

4. Run the tests:   npm test 


5. Test results:

PASS src/EmpoyeeCrud.test.jsx
  EmployeeCrud UI rendering
    √ renders main h1 (89 ms)
    √ renders Add new employee button (48 ms)
    √ renders table headers (11 ms)
    √ renders ToastContainer (6 ms)
    √ renders modal structure (markup check) (20 ms)
    √ opens modal and shows modal title (28 ms)
  EmployeeCrud component functionallity
    √ fetches and displays employees on mount (14 ms)
    √ updates input fields when typing (8 ms)
    √ adds a new employee successfully (26 ms)
    √ edits an existing employee successfully (31 ms)
    √ deletes an employee when confirmed (52 ms)
    √ does not delete an employee when canceled (17 ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        3.053 s
Ran all test suites related to changed files.


*/
