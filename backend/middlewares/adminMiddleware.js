const jwt = require("jsonwebtoken");

const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;

function adminMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    res.status(401).json({
      msg: "Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD); 
    req.adminId = decoded.id; 
    next(); 
  } catch (e) {
    res.status(401).json({
      msg: "Invalid token"
    });
  }
}

module.exports = {
  adminMiddleware,
};
