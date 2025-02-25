const express = require("express");
const Website = require("../models/Website");
const Homepage = require("../models/Homepage");
const Pricing = require("../models/Pricing");
const About = require("../models/About");
const Service = require("../models/Service");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Get all websites
router.get("/", async (req, res) => {
  try {
    res.render("add-website"); 
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});

module.exports = router;
