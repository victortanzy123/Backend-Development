const express = require("express");
const router = express.Router();

// Express-validator:
const { check, validationResult } = require("express-validator");

// JWT Token Authentication Middleware:
const authToken = require("../../middleware/jwtAuth");

// Model Schemas:
const Item = require("../../models/Item");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

/// @Route: GET /api/orders
/// @Desc: To track orders belonging to an account
/// @access: Private
router.get("/", authToken, async (req, res) => {
  try {
    // Retrieve orders belonging to user ID:
    const orders = await Order.find({ user: req.user.id }).toArray();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/// @Route: POST /api/orders
/// @Desc: To initialise an order upon confirmation
/// @access: Private
router.post(
  "/",
  [authToken, check("items", "Empty cart not permitted").isLength({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add cart items to order:
    const { itemsInCart } = req.body;

    try {
      // Retrieve Profile by user ID:
      const profile = await Profile.findOne({ user: req.user.id });

      // Create and save order to database:
      const newOrder = new Order({
        user: req.user.id,
        profile: profile._id,
        items: itemsInCart,
        status: "Pending, awaiting Confirmation",
      });

      const order = await newOrder.save();
      res.status(200).json(order);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
