const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
    },
  ],
  status: {
    type: String,
    required: true,
  },
  dateOfOrder: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Order = mongoose.model("order", OrderSchema);
