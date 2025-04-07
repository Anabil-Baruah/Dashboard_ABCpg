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
    const userDetail = await User.find({ role: "subadmin" })
    const websites = await Website.find();
    res.render("user-management", { userDetail, websites })
  } catch (error) {
    res.status(500).json({ error: "Failed to create homepage", details: error.message });
  }
});


module.exports = router;
