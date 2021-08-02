const jwt = require("jsonwebtoken");

// JWT Secret Key:
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// JWT Authentication Middleware:
module.exports = (req, res, next) => {
  // Retrieve token from header:
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied!" });
  }

  // If token retrieved, verify it:
  try {
    // Using JWT verify:
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    // Set req.user to decoded user object for easier use of userID matching in other api routes:
    req.user = decoded.user;
    console.log(decoded);

    // Done:
    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({ message: "Token is invalid!" });
  }
};
