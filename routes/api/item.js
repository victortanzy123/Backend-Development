const express = require("express");
const router = express.Router();

// Admin Authentication Middleware:
const adminAuth = require("../../middleware/adminAuth");

// Express validator:
const { check, validationResult } = require("express-validator");

// Model Schemas:
const Item = require("../../models/Item");

/// @route GET api/items
/// @desc Fetch all products listed
/// @access public
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });

    if (!items) {
      return res.status(200).json({ message: "No items listed yet :(" });
    }

    // If got items:
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/// @route GET api/items/:id
/// @desc Fetch specific product when selected
/// @access public
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found :(" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Item not found :(" });
    }
    res.status(500).send("Server Error");
  }
});

/// @route POST api/items/list
/// @desc List an item
/// @access PRIVATE-ADMIN ONLY
router.post(
  "/list",
  [
    adminAuth,
    [
      check("name", "Name of product is required").not().isEmpty(),
      check("description", "Description of product is required.")
        .not()
        .isEmpty(),
      check("price", "Price of product is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Errors - express validation:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(40).json({ errors: errors.array() });
    }

    const { name, description, price, imageURL, quantity } = req.body;

    try {
      // Create new item and save to database:
      let newItem = new Item({
        name,
        description,
        price,
        imageURL,
        quantity: quantity ? quantity : 99999,
      });

      const item = await newItem.save();

      res.json(item);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/// @route PUT api/items/list/:id
/// @desc Updated a LISTED an item
/// @access PRIVATE-ADMIN ONLY
/// @Remarks: lagging O_O
router.put(
  "/list/:id",
  [
    adminAuth,
    [
      check("name", "Name of product is required").not().isEmpty(),
      check("description", "Description of product is required.")
        .not()
        .isEmpty(),
      check("price", "Price of product is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, imageURL, quantity } = req.body;

    const updatedItem = {};

    if (name) updatedItem.name = name;
    if (description) updatedItem.description = description;
    if (price) updatedItem.price = price;
    if (imageURL) updatedItem.imageURL = imageURL;
    if (quantity) updatedItem.quantity = quantity;
    try {
      // Retrieve existing item document:
      const item = await Item.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: updatedItem }
      );

      if (!item) {
        return res.status(400).json({ message: "Item not found!" });
      }

      res.status(201).json(item);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/// @route DELETE api/items/list/:id
/// @desc Delete a LISTED an item
/// @access PRIVATE-ADMIN ONLY
router.delete("/list/:id", adminAuth, async (req, res) => {
  try {
    // Delete item specified by id in params:
    await Item.findOneAndRemove({ _id: req.params.id });

    res.status(200).json({ message: "Item deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
