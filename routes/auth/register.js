const express = require("express");
const router = express.Router();
const User = require("../../model/user");

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({
      userName,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully", 
      userId: newUser._id, 
      userName: newUser.userName 
    });

    console.log(`New User Registered With ID: ${newUser._id}, Username: ${newUser.userName}`);
  } catch (err) {
    console.log("Error during registration: " + err);
    res.status(500).json({ 
      message: "Error during registration", 
      reason: "Internal server error." 
    });
  }
});

module.exports = router;
