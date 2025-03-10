const express = require("express");
const router = express.Router();

const Website = require("../models/Website");


router.get("/:id", async (req, res) => {
  try {
    const website = await Website.findOne({ _id: req.params.id }).populate("home").populate("pricing").populate("about").populate("service").populate("footer");   

    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }
    console.log(website, "website") 
    res.render('abcPgs/index', { website })
  } catch (error) {
    res.status(500).json({ error: "Failed to create homepage" });
  }
});


module.exports = router;
