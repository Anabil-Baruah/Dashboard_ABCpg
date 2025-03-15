const express = require("express");

const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Get all websites
router.get("/", async (req, res) => {
  try {
    res.render("login"); 
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});

module.exports = router;
