const express = require("express");
const upload = require("../config/multerConfig");
const Website = require("../models/Website");
const Homepage = require("../models/Homepage");
const Pricing = require("../models/Pricing");
const About = require("../models/About");
const Service = require("../models/Service");
const Footer = require("../models/Footer");
const dotenv = require("dotenv");


dotenv.config();

const router = express.Router();

// Get all websites
router.get("/", async (req, res) => {
  try {
    const websites = await Website.find().populate("home");
    res.render("index", { websites: websites });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});


router.get("/add-website/add", async (req, res) => {
  try {
    const websites = await Website.find().populate("home").populate("pricing");
    res.render("add-website");
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
      .populate("footer") // Populating footer details
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
router.post(
  "/",
  upload.fields([
    { name: "homeBgImage" },
    { name: "serviceBackground" },
    { name: "serviceVideoThumbnail" },
    { name: "serviceVideo" },
    { name: "featuresImages" }, // Allow multiple feature images
    { name: "serviceCardImages" },
    { name: "priceIcons" }
  ]),
  async (req, res) => {
    console.log(req.files, "req file")
    try {

      // console.log("Received files:", req.files); // Debugging

      // Extract text data
      const {
        name, websiteThemeColor, brandName, contactNumber, contactLink,
        heading, subheading, buttonText, buttonLink,
        aboutToggle, servicesToggle, pricingToggle,
        aboutTitle, aboutHeading, featureArray, pricingPlansArray,
        serviceTitle, serviceHeading, serviceDescription, serviceFeatures,
        priceTitle, priceHeading, priceSubheading, footerHeading, footerSubheading,
        address, footerPhoneNumber, footerEmail, linkInstagram, linkFacebook, linkX
      } = req.body;

      // Extract uploaded image filenames
      const homeBgImage = req.files["homeBgImage"] ? req.files["homeBgImage"][0].filename : null;
      const serviceBackground = req.files["serviceBackground"] ? req.files["serviceBackground"][0].filename : null;
      const serviceVideoThumbnail = req.files["serviceVideoThumbnail"] ? req.files["serviceVideoThumbnail"][0].filename : null;
      const serviceVideo = req.files["serviceVideo"] ? req.files["serviceVideo"][0].filename : null;

      const extractedFeatureIcons = req.files["extractedFeatureIcons"] || []; // Array of feature images

      // Convert JSON strings back to arrays/objects
      const parsedFeatureArray = JSON.parse(featureArray || "[]");
      const parsedServiceFeatures = JSON.parse(serviceFeatures || "[]");
      // const parsedServiceCards = JSON.parse(serviceCards || "[]");
      const parsedPricingPlansArray = JSON.parse(pricingPlansArray || "[]");

      // Assign uploaded feature images to the correct features
      // const features = req.files["featuresImages"]
      //   ? req.files["featuresImages"].map((file, index) => ({
      //     title: req.body.featureTitles[index] || `Feature ${index + 1}`,
      //     description: req.body.featureDescs[index] || "No description provided",
      //   }))
      //   : [];

      const serviceCards = req.files["serviceCardImages"]
        ? req.files["serviceCardImages"].map((file, index) => ({
          title: req.body.serviceTitles[index] || `Service ${index + 1}`,
        }))
        : [];


      // const pricePlans = req.files["priceIcons"]
      //   ? req.files["priceIcons"].map((file, index) => ({
      //     title: req.body.pricePlanTitles[index] || `Plan ${index + 1}`,
      //     price: {
      //       value: Number(req.body.priceValues[index]) || 0,
      //       currency: req.body.priceCurrencies[index] || "₹",
      //       duration: req.body.priceDurations[index] || "mo",
      //     },
      //     icon: {
      //       url: `${file.filename}`,
      //       backgroundColor: req.body.priceBgColors[index] || "#FFFFFF",
      //     },
      //     features: req.body.priceFeatures ? req.body.priceFeatures[index] || [] : [],
      //   }))
      //   : [];


      // Construct MongoDB-compatible objects
      const homeData = {
        navbar: {
          brandName,
          contact: { number: contactNumber, status: true, link: contactLink },
          about: { status: aboutToggle === "true" },
          services: { status: servicesToggle === "true" },
          team: { status: true },
          pricing: { status: pricingToggle === "true" },
          blog: { status: true }
        },
        content: {
          heading,
          homeBgImage,
          subheading,
          buttonText,
          buttonLink
        }
      };

      const aboutData = {
        title: aboutTitle,
        heading: aboutHeading,
        features: parsedFeatureArray
      };

      const servicesData = {
        title: serviceTitle,
        heading: serviceHeading,
        backgroundImage: serviceBackground,
        description: serviceDescription,
        features: parsedServiceFeatures,
        card: serviceCards,
        video: {
          url: serviceVideo,
          thumbnail: serviceVideoThumbnail
        }
      };

      const pricingData = {
        title: priceTitle,
        heading: priceHeading,
        subheading: priceSubheading,
        pricingPlansArray: parsedPricingPlansArray
      };

      const footerData = {
        heading: footerHeading,
        subHeading: footerSubheading,
        address: address,
        phoneNumber: footerPhoneNumber,
        email: footerEmail,
        socials: {
          instagram: linkInstagram,
          facebook: linkFacebook,
          x: linkX
        }
      }

      // Save data to MongoDB
      const home = new Homepage(homeData);
      await home.save();

      const pricing = new Pricing(pricingData);
      await pricing.save();

      const about = new About(aboutData);
      await about.save();

      const service = new Service(servicesData);
      await service.save();

      const footer = new Footer(footerData);
      await footer.save();

      const website = new Website({
        name,
        websiteThemeColor,
        home: home._id,
        pricing: pricing._id,
        about: about._id,
        service: service._id,
        footer: footer._id
      });

      await website.save();

      res.status(201).json({
        message: "Website created successfully!",
        website
      });
    } catch (error) {
      console.error("Error creating website:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


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
    if(website.footer){
      await Footer.deleteOne({ _id: website.footer });
    }

    // Delete the Website document
    await Website.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Website and related documents deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete website", details: error.message });
  }
});


module.exports = router;
