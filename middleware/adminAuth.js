// Admin Secret Key:
require("dotenv").config();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

module.exports = (req, res, next) => {
  // Using headers to request admin secret key
  const admin_token = req.header("admin-token");

  if (!admin_token) {
    return res.status(401).json({ message: "Authorization Not Allowed" });
  } else if (
    // If admin token provided, compare:
    admin_token !== ADMIN_SECRET_KEY
  ) {
    return res.status(401).json({ message: "Authorizationz Not Allowed." });
  }

  next();
};
