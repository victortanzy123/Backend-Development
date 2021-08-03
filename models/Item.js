const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 99999,
    },
  },
  { timestamps: true }
);

module.exports = Item = mongoose.model("item", ItemSchema);
