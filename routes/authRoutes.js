const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");  // 🔥 ADD THIS
const User = require("../models/User");                      // 🔥 ADD THIS

// SIGNUP
router.post("/signup", signup);

// LOGIN
router.post("/login", login);

// GET USERS
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;