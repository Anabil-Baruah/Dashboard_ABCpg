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
router.get("/:id", async (req, res) => {
    try {
        const wesbiteId = req.params.id
        let userDetail = await User.findOne({ role: "admin" })
        const websiteDetail = await Website.findOne({ _id: wesbiteId })
            .populate("home pricing team about service footer")
            .exec();

        userDetail.website = websiteDetail
        res.render('index-subadmin', { userDetail })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch websites" });
    }
});

module.exports = router;
