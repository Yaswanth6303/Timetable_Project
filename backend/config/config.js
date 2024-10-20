// Retrieve the JWT faculty password from environment variables
const JWT_FACULTY_PASSWORD = process.env.JWT_FACULTY_PASSWORD; // Access the JWT secret for faculty authentication

// Retrieve the JWT user password from environment variables
const JWT_STUDENT_PASSWORD = process.env.JWT_STUDENT_PASSWORD; // Access the JWT secret for student authentication

// Export the retrieved JWT passwords so they can be used in other modules
module.exports = {
    JWT_FACULTY_PASSWORD, // Exporting the faculty JWT password
    JWT_STUDENT_PASSWORD, // Exporting the student JWT password
};
