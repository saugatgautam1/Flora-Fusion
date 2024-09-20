const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://saugatgautam:Cw4IQvtfbJZTAcxF@e-commerce.7trg5.mongodb.net/?retryWrites=true&w=majority&appName=E-commerce"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // Added email field
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Signup route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the required fields are present
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Email, username, and password are required" });
  }

  try {
    // Check if user or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User or email already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});
// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Find user with matching username and password
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful", username: user.username });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});
app.get("/checkout", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: "key live_secret_key_68791341fdd94846a146f0457ff7b455",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: "http://example.com/",
      website_url: "https://example.com/",
      amount: "10000",
      purchase_order_id: "Order01",
      purchase_order_name: "test",
      customer_info: {
        name: "User",
        email: "test@khalti.com",
        phone: "9800000001",
      },
    }),
  };
  let responseofkhalti = await fetch(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    options
  );
  jsondata = await responseofkhalti.json();
  console.log(jsondata);
  res.send(jsondata);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
