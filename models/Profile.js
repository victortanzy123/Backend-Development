const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  // Reference to user document created:
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  contact: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  unitNumber: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  purchasedItems: [],
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
