const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./config/MongoDB");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB:
connectDB();

// Middleware to deal with CORS error:
app.use(
  cors({
    origin: `http://localhost:3000`,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middleware to get data parse in req.body:
app.use(express.json({ extend: false }));

// // Testing Server:
// app.get("/", (req, res) => {
//   res.send("API RUNNING");
// });

// Defining Routes: (Another Middleware)
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/items", require("./routes/api/item"));
app.use("api/orders", require("./routes/api/order"));
// Listen to Backend URL:
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
