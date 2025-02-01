const express = require("express");
const router = express.Router();
const User = require("../../model/user");

router.delete("/deleteall", async (req, res) => {
  try {
    await User.deleteMany({});  
    res.status(200).json({ message: "All user records deleted successfully" });
    console.log("All user records deleted.");
  } catch (err) {
    console.log("Error during deletion: " + err);
    res.status(500).json({
      message: "Error during deletion",
      reason: "Internal server error.",
    });
  }
});

module.exports = router;
