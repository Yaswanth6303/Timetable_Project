const jwt = require("jsonwebtoken");

const JWT_FACULTY_PASSWORD = require("../config/config");

function facultyMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    res.status(401).json({
      msg: "Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_FACULTY_PASSWORD);
    req.facultyId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({
      msg: "Invalid token"
    });
  }
}

module.exports = {
  facultyMiddleware,
};
