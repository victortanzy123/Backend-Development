const express = require("express");
const router = express.Router();

// Secret key for JWT:
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Password Hashing:
const bcrypt = require("bcryptjs");

// JSON Web Token:
const jwt = require("jsonwebtoken");

// Express-Validation for backend:
const { check, validationResult } = require("express-validator");

// Schemas:
const User = require("../../models/User");

/// @route POST api/users
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email!").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Set errors from error validation:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exist, if so reject:
      let user = await User.findOne({ email: email.trim().toLowerCase() });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: "User already exists!" }] });
      }

      // If all validation passes, save user to database:
      user = new User({
        name,
        email,
        password,
      });

      // Hash password using bcrypt:
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);

      // Save to database:
      await user.save();

      // Return JSON Web Token upon successful registration:
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }

        // if token is generated:
        res.json({ authentication: "Success", token: token });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
