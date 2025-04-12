const express = require("express");
const User = require("../models/User")
const { auth2, auth } = require('../auth')

const router = express.Router();

/** 
 * @route   POST /api/home
 * @desc    Create homepage data
 */

router.get("/", async (req, res) => {
    res.render("index-subadmin")
})

router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const userDetail = await User.findOne({ role: "subadmin", _id: userId })
            .populate({
                path: "website",
                populate: [
                    { path: "home", model: "Homepage" },
                    { path: "pricing", model: "Pricing" },
                    { path: "about", model: "About" },
                    { path: "team", model: "Team" },
                    { path: "service", model: "Service" },
                    { path: "footer", model: "Footer" }
                ]
            });
            // console.log(userDetail, "features")
        res.render("index-subadmin", { userDetail })
    } catch (error) {
        res.status(500).json({ error: "Failed to create homepage", details: error.message });
    }
});


module.exports = router;
