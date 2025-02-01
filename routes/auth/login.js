const express = require("express");
const router = express.Router();
const User = require("../../model/user");

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ 
      message: "Authentication successful", 
      userId: user._id,
      userName: user.userName 
    });

    console.log(`User Login With ID: ${user._id}, Username: ${user.userName}`);
  } catch (err) {
    console.log("Error during login: " + err);
    res.status(500).json({
      message: "Error during login",
      reason: "Internal server error.",
    });
  }
});

module.exports = router;
