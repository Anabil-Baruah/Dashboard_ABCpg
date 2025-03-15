const express = require("express");
const router = express.Router();

const Website = require("../models/Website");


router.get("/:name", async (req, res) => {
  try {
    const website = await Website.findOne({ name: req.params.name }).populate("home").populate("team").populate("pricing").populate("about").populate("service").populate("footer");   
    console.log(website, "website")
    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }
    res.render('abcPgs/index', { website })
  } catch (error) {
    res.status(500).json({ error: "Failed to create homepage" });
  }
});
router.get("/:name/index-2", async (req, res) => {
  try {
    const website = await Website.findOne({ _id: req.params.name }).populate("home").populate("pricing").populate("about").populate("service").populate("footer");   

    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }
    res.render('abcPgs/index-2', { website })
  } catch (error) {
    res.status(500).json({ error: "Failed to create homepage" });
  }
});


module.exports = router;
