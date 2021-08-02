const express = require("express");
const router = express.Router();

// JWT Secret Key:
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Comparing hashed password:
const bcrypt = require("bcryptjs");

// JWT Token:
const jwt = require("jsonwebtoken");

// Validation by express-validator:
const { check, validationResult } = require("express-validator");

// import JWT Authentication Middleware:
const authToken = require("../../middleware/jwtAuth");

// Scehmas:
const User = require("../../models/User");

/// @route GET api/auth
/// @desc Retrieve user details with Token verification step included
/// @access public
router.get("/", authToken, async (req, res) => {
  try {
    // user has been stored in req.user already
    const user = await User.findById(req.user.id).select("-password");

    // Return user:
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/// @Route POST /api/auth
/// @Desc Login with existing user account, returns a JWT upon successful verfication
/// @access public
router.post(
  "/",
  [
    check("email", "Please enter a valid email.").isEmail(),
    check("password", "Password is required.").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Look for user in database:
      let user = await User.findOne({ email: email.trim().toLowerCase() });

      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials!" });
      }

      // user is found, check if password matches:
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            { message: "You entered the wrong email/password, try again!" },
          ],
        });
      }

      // If email and password matches, GENERATE JWT and log user in with it!
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }

        // if token successfully generated, return it
        res.json({ authentication: "Success!", token });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
