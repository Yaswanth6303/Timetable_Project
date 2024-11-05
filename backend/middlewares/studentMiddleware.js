const jwt = require("jsonwebtoken");

const JWT_STUDENT_PASSWORD = process.env.JWT_STUDENT_PASSWORD;

function studentMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    res.status(401).json({
      msg: "Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_STUDENT_PASSWORD); 
    req.studentId = decoded.id; 
    next(); 
  } catch (e) {
    res.status(401).json({
      msg: "Invalid token"
    });
  }
}

module.exports = {
    studentMiddleware
};
