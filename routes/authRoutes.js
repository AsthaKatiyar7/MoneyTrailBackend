const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// POST /signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('1');
    const existing = await User.findOne({ username });
    console.log('2');
    if (existing) return res.status(400).json({ error: "User already exists" });
    console.log('3');

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: password });
    console.log('4');
    console.log('Request body:', req.body);
    console.log('Username:', username, 'Password:', password);
    await user.save();
    console.log('5');

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /login - Accept any credentials for testing
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Generate token without checking credentials
    const token = jwt.sign(
      { id: '123', username: username },
      'test-secret-key',
      { expiresIn: "30d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
