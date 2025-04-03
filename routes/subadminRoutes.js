const express = require("express");
const User = require("../models/User")

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
        const userDetail = await User.find({ role: "subadmin", _id: userId })
        res.render("user-management", { userDetail })
    } catch (error) {
        res.status(500).json({ error: "Failed to create homepage", details: error.message });
    }
});


module.exports = router;
