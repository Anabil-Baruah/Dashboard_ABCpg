const express = require("express");
const User = require("../models/User")
const Website = require("../models/Website")
const { auth2, auth } = require('../auth')

const router = express.Router();

/** 
 * @route   POST /api/home
 * @desc    Create homepage data
 */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const userDetails = await User.find({ role: "subadmin" })
      const userDetail = req.user
      const websites = await Website.find();
      res.render("user-management", { userDetails, websites, userDetail })
    }else{
      res.json("Unauthorized")
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create homepage", details: error.message });
  }
});


module.exports = router;
