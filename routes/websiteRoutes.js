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
    const websites = await Website.find().populate("home").populate("pricing");
    console.log("hit route")
    res.render("index");    
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});


// Get a specific website by ID
router.get("/:id", async (req, res) => {
  try {
    const website = await Website.findById(req.params.id)
      .populate("home") // Populating homepage details
      .populate("pricing") // Populating pricing page details
      .populate("about") // Populating about page details
      .populate("service") // Populating service page details
      .exec();

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    res.json(website);
  } catch (error) {
    console.error("Error fetching website:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 
 * @route   POST /api/websites
 * @desc    Create a new website with homepage & pricing
 */
router.post("/", async (req, res) => {
  try {
    const { name, homeData, pricingData, aboutData, servicesData } = req.body;

    // Create the Homepage document
    const home = new Homepage(homeData);
    await home.save();

    // Create the Pricing document
    const pricing = new Pricing(pricingData);
    await pricing.save();

    // Create the About document
    const about = new About(aboutData);
    await about.save();

    //Create the service document
    const service = new Service(servicesData);
    await service.save();

    // Create the Website document with references to Homepage and Pricing
    const website = new Website({
      name,
      home: home._id,
      pricing: pricing._id,
      about: about._id,
      service: service._id,
    });

    await website.save();

    res.status(201).json({
      message: "Website created successfully!",
      website,
    });
  } catch (error) {
    console.error("Error creating website:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** 
 * @route   DELETE /api/websites/:id
 * @desc    Delete a website
 */
router.delete("/:id", async (req, res) => {
  try {
    const website = await Website.findOne({ _id: req.params.id });
    // console.log(website);
    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }

    // Delete associated Homepage and Pricing documents
    if (website.home) {
      await Homepage.deleteOne({ _id: website.home });
    }
    if (website.pricing) {
      await Pricing.deleteOne({ _id: website.pricing });
    }
    if (website.about) {
      await About.deleteOne({ _id: website.about });
    }
    if (website.service) {
      await Service.deleteOne({ _id: website.service });
    }

    // Delete the Website document
    await Website.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Website and related documents deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete website", details: error.message });
  }
});


module.exports = router;
