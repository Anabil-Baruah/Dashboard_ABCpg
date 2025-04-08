const express = require("express");
const Website = require("../models/Website");
const Homepage = require("../models/Homepage");
const Pricing = require("../models/Pricing");
const About = require("../models/About");
const Service = require("../models/Service");
const User = require("../models/User")
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Get all websites
router.get("/", async (req, res) => {
  try {
    const userDetail = await User.findOne({ role: "admin" })
    res.render("add-website", {userDetail}); 
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});

module.exports = router;
