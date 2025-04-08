const express = require("express");
const User = require("../models/User")
const Website = require("../models/Website")

const router = express.Router();

/** 
 * @route   POST /api/home
 * @desc    Create homepage data
 */
router.get("/", async (req, res) => {
  try {
    const userDetails = await User.find({ role: "subadmin" })
    const userDetail = await User.findOne({ role: "admin" })
    const websites = await Website.find();
    res.render("user-management", { userDetails, websites, userDetail })
  } catch (error) {
    res.status(500).json({ error: "Failed to create homepage", details: error.message });
  }
});


module.exports = router;
