// Import the jsonwebtoken library for JWT operations
const jwt = require("jsonwebtoken");

// Import the JWT secret key from the configuration file
const JWT_FACULTY_PASSWORD = process.env.JWT_FACULTY_PASSWORD;

/**
 * Middleware function to authenticate faculty members.
 * 
 * This middleware checks for a valid JWT token in the request headers 
 * and verifies it.
 If the token is valid, it extracts the faculty ID 
 * and adds it to the request object. If the token is invalid or missing, 
 * it sends a 401 Unauthorized response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
function facultyMiddleware(req, res, next) {
  // Get the JWT token from the request headers
  const token = req.headers.token;

  // Check if the token is present in the headers
  if (!token) {
    // If the token is missing, send a 401 Unauthorized response
    res.status(401).json({
      msg: "Token is missing",
    });
  }

  // If the token is present, try to verify it
  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, JWT_FACULTY_PASSWORD); 
    // If the token is valid, extract the faculty ID from the decoded token
    req.facultyId = decoded.id; 
    // Call the next middleware function in the stack
    next(); 
  } catch (e) {
    // If the token is invalid, send a 401 Unauthorized response
    res.status(401).json({
      msg: "Invalid token"
    });
  }
}

// Export the facultyMiddleware function to be used in other parts of the application
module.exports = {
  facultyMiddleware,
};
