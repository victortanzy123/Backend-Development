const mongoose = require("mongoose");

require("dotenv").config();

// MongoDB URL:
const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    // Establish connection with database:
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("MongoDB Connection Established...");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
