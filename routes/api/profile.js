const express = require("express");
const router = express.Router();

// JWT Verfication Middleware:
const authToken = require("../../middleware/jwtAuth");

// Express Validation:
const { check, validationResult } = require("express-validator");

//Schemas:
const Profile = require("../../models/Profile");
const User = require("../../models/User");

/// @route GET api/profile/me
/// @desc Get current users profile
/// @access Private
router.get("/me", authToken, async (req, res) => {
  try {
    // Since got reference, can add in by populate():
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email"]
    );

    if (!profile) {
      return res
        .status(400)
        .json({ message: "There is no profile for this user yet." });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/// @route GET api/profile
/// @desc Retrieve ALL Profiles
/// @access Private
router.get("/", authToken, async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ date: -1 });
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/// @route GET api/profile/me
/// @desc CREATE or UPDATE user profile
/// @access Private - wrap authToken with array of checks
router.post("/", [
  authToken,
  [
    check("contact", "Contact number is required")
      .trim()
      .isLength({ min: 8, max: 8 }),
    check("address", "Address is required").not().isEmpty(),
    check("unitNumber", "Unit no. is required").not().isEmpty(),
    check("postalCode", "Postal Code is required")
      .trim()
      .isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contact, address, unitNumber, postalCode } = req.body;

    const profileDetails = {
      user: req.user.id,
      contact,
      address,
      unitNumber,
      postalCode,
    };

    // Check if profile exists already:
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // if exists, update profile:
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileDetails },
          { new: true }
        );

        return res.status(201).json(profile);
      }

      // If creating new profile:
      profile = new Profile(profileDetails);

      // save to database:
      await profile.save();
      res.status(201).json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },
]);

///@Route DELETE api/profile
///@Desc Delete Profile, user & orders:
router.delete("/", authToken, async (req, res) => {
  try {
    // @todo - remove user's past orders
    // await Order.deleteMany({ user: req.user.id });

    // Remove profile:
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user:
    await User.findOneAndRemove({ _id: req.user.id });

    res.status(200).json({ message: "Account deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
