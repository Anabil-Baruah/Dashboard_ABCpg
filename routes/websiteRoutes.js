const express = require("express");
const upload = require("../config/multerConfig");
const Website = require("../models/Website");
const Homepage = require("../models/Homepage");
const Pricing = require("../models/Pricing");
const About = require("../models/About");
const Service = require("../models/Service");
const Footer = require("../models/Footer");
const Team = require("../models/Team");
const User = require("../models/User")
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { auth2, auth } = require('../auth')


dotenv.config();

const router = express.Router();

// Get all websites
router.get("/", auth, async (req, res) => {
  try {
    const userDetail = req.user
    if (userDetail.role === "admin") {
      const websites = await Website.find().populate("home");
      res.render("index", { websites: websites, userDetail });
    } else {
      res.json("Unauthorised")
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});
router.get("/sub-admin", auth, async (req, res) => {
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
router.get("/:name", async (req, res) => {
  try {
    const website = await Website.findOne({ name: req.params.name })
    const userDetail = await User.findOne({ role: "subadmin" })
      .populate("home") // Populating homepage details
      .populate("pricing") // Populating pricing page details
      .populate("about") // Populating about page details
      .populate("team") // Populating team page details
      .populate("service") // Populating service page details
      .populate("footer") // Populating footer details
      .exec();
    if (!website) {
      return res.status(404).json({ message: "Website not found", userDetail });
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
  "/", auth,
  upload.fields([
    { name: "serviceVideoThumbnail" },
    { name: "serviceVideo" },
    { name: "featuresImages" }, // Allow multiple feature images
    { name: "serviceCardImages" },
    { name: "navImage" },
    { name: "teamImages", maxCount: 20 }
  ]),
  async (req, res) => {
    // console.log(req.files, "req file")
    try {

      const {
        name, websiteThemeColor, brandName, contactNumber, contactLink,
        heading, subheading, buttonText, buttonLink,
        aboutToggle, servicesToggle, pricingToggle,
        aboutTitle, aboutHeading, featureArray, pricingPlansArray,
        serviceTitle, serviceHeading, serviceDescription, serviceFeatures, teamHeading,
        priceTitle, priceHeading, priceSubheading, footerHeading, footerSubheading,
        address, footerPhoneNumber, footerEmail, linkInstagram, linkFacebook, linkX
      } = req.body;

      const nameExist = await Website.findOne({ name: name })
      if (nameExist) {
        res.status(301).json({ message: "Name already exist choose a different name" });
        return
      }

      // Extract uploaded image filenames
      const serviceVideoThumbnail = req.files["serviceVideoThumbnail"] ? req.files["serviceVideoThumbnail"][0].filename : null;
      const serviceVideo = req.files["serviceVideo"] ? req.files["serviceVideo"][0].filename : null;

      const extractedFeatureIcons = req.files["extractedFeatureIcons"] || []; // Array of feature images

      // Convert JSON strings back to arrays/objects
      const parsedFeatureArray = JSON.parse(featureArray || "[]");
      const parsedServiceFeatures = JSON.parse(serviceFeatures || "[]");
      // const parsedServiceCards = JSON.parse(serviceCards || "[]");
      const parsedPricingPlansArray = JSON.parse(pricingPlansArray || "[]");


      // const serviceCards = req.files["serviceCardImages"]
      //   ? req.files["serviceCardImages"].map((file, index) => ({
      //     title: req.body.serviceTitles[index] || `Service ${index + 1}`,
      //   }))
      //   : [];

      const navBarImg = req.files["navImage"] ? req.files["navImage"][0].filename : null;
      const serviceCards = req.body?.serviceTitles?.map((title, index) => ({ title }));
      const teamImages = req.files["teamImages"] ? req.files["teamImages"].map(file => `${file.filename}`) : [];

      // Construct MongoDB-compatible objects
      const homeData = {
        navbar: {
          brandName: brandName,
          navBarImg: navBarImg,
          contact: { number: contactNumber, status: true, link: contactLink },
          about: { status: aboutToggle === "true" },
          services: { status: servicesToggle === "true" },
          team: { status: true },
          pricing: { status: pricingToggle === "true" },
          blog: { status: true }
        },
        content: {
          heading,
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

      const teamData = {
        heading: teamHeading,
        images: teamImages
      }

      const servicesData = {
        title: serviceTitle,
        heading: serviceHeading,
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

      const team = new Team(teamData);
      await team.save();

      const service = new Service(servicesData);
      await service.save();

      const footer = new Footer(footerData);
      await footer.save();

      const website = new Website({
        name,
        websiteThemeColor,
        home: home._id,
        pricing: pricing._id,
        team: team._id,
        about: about._id,
        service: service._id,
        footer: footer._id
      });

      await website.save();
      // console.log(website)
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

router.post("/edit/:id", auth, upload.fields([
  { name: "serviceVideoThumbnail" },
  { name: "serviceVideo" },
  { name: "featuresImages" },
  { name: "serviceCardImages" },
  { name: "navImage" },
  { name: "teamImages", maxCount: 20 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body, "id")

    const {
      name, websiteThemeColor, brandName, contactNumber, contactLink,
      heading, subheading, buttonText, buttonLink,
      aboutToggle, servicesToggle, pricingToggle,
      aboutTitle, aboutHeading, featureArray, pricingPlansArray,
      serviceTitle, serviceHeading, serviceDescription, serviceFeatures, teamHeading,
      priceTitle, priceHeading, priceSubheading, footerHeading, footerSubheading,
      address, footerPhoneNumber, footerEmail, linkInstagram, linkFacebook, linkX
    } = req.body;
    let user = req.user
    let website
    if (req.user.role === "admin") {
      website = await Website.findById(id)
        .populate("home pricing team about service footer");
    }
    else if (req.user.role === "subadmin") {
      website = await Website.findById(user.website)
        .populate("home pricing team about service footer");
    } else {
      return res.status(404).json({ message: "error" })
    }


    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    // Extract uploaded image filenames
    const serviceVideoThumbnail = req.files["serviceVideoThumbnail"] ? req.files["serviceVideoThumbnail"][0].filename : null;
    const serviceVideo = req.files["serviceVideo"] ? req.files["serviceVideo"][0].filename : null;
    const teamImages = req.files["teamImages"] ? req.files["teamImages"].map(file => `${file.filename}`) : [];
    const serviceCards = req.body?.serviceTitles?.map((title, index) => ({ title }));

    console.log(serviceVideo, serviceVideoThumbnail, "these")

    // Parse incoming JSON strings to arrays/objects
    const parsedFeatureArray = JSON.parse(featureArray || "[]");
    const parsedServiceFeatures = JSON.parse(serviceFeatures || "[]");
    const parsedPricingPlansArray = JSON.parse(pricingPlansArray || "[]");

    // Update nested documents
    await Homepage.findByIdAndUpdate(website.home, {
      navbar: {
        brandName,
        contact: { number: contactNumber, status: true, link: contactLink },
        about: { status: aboutToggle === "true" },
        services: { status: servicesToggle === "true" },
        team: { status: true },
        pricing: { status: pricingToggle === "true" },
        blog: { status: true }
      },
      content: { heading, subheading, buttonText, buttonLink }
    });

    await About.findByIdAndUpdate(website.about, {
      title: aboutTitle,
      heading: aboutHeading,
      features: parsedFeatureArray
    });

    await Team.findByIdAndUpdate(website.team, {
      $set: {
        heading: teamHeading,
        ...(teamImages.length > 0 && { images: teamImages })
      }
    });

    await Service.findByIdAndUpdate(website.service, {
      $set: {
        title: serviceTitle,
        heading: serviceHeading,
        description: serviceDescription,
        features: parsedServiceFeatures,
        card: serviceCards,
        ...(serviceVideo && { "video.url": serviceVideo }),
        ...(serviceVideoThumbnail && { "video.thumbnail": serviceVideoThumbnail })
      }
    });

    await Pricing.findByIdAndUpdate(website.pricing, {
      title: priceTitle,
      heading: priceHeading,
      subheading: priceSubheading,
      pricingPlansArray: parsedPricingPlansArray
    });

    await Footer.findByIdAndUpdate(website.footer, {
      heading: footerHeading,
      subHeading: footerSubheading,
      address,
      phoneNumber: footerPhoneNumber,
      email: footerEmail,
      socials: {
        instagram: linkInstagram,
        facebook: linkFacebook,
        x: linkX
      }
    });

    // Update Website root object
    website.name = name;
    website.websiteThemeColor = websiteThemeColor;
    await website.save();

    res.status(200).json({ message: "Website updated successfully", website });

  } catch (error) {
    console.error("Error updating website:", error);
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

    // Delete associated Homepage and its navbar image
    if (website.home) {
      const homepage = await Homepage.findById(website.home);
      if (homepage?.navbar?.navBarImg) {
        const navbarImagePath = path.join(__dirname, "..", "public", "uploads", homepage.navbar.navBarImg);
        fs.unlink(navbarImagePath, (err) => {
          if (err) console.error(`Error deleting homepage navbar image ${homepage.navbar.navBarImg}:`, err);
        });
      }
      await Homepage.deleteOne({ _id: website.home });
    }
    if (website.pricing) {
      await Pricing.deleteOne({ _id: website.pricing });
    }
    if (website.team) {
      const team = await Team.findById(website.team);
      if (team && team.images.length > 0) {
        team.images.forEach(imageUrl => {
          const filePath = path.join(__dirname, "..", "public", "uploads", imageUrl); // Convert to absolute path
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting image ${imageUrl}:`, err);
          });
        });
      }
      await Team.deleteOne({ _id: website.team });
    }
    if (website.about) {
      await About.deleteOne({ _id: website.about });
    }
    if (website.service) {
      const service = await Service.findById(website.service);
      if (service) {
        // Delete video file
        if (service.video?.url) {
          const videoPath = path.join(__dirname, "..", "public", "uploads", service.video.url);
          fs.unlink(videoPath, err => {
            if (err) console.error(`Error deleting service video ${service.video.url}:`, err);
          });
        }
        // Delete video thumbnail
        if (service.video?.thumbnail) {
          const thumbnailPath = path.join(__dirname, "..", "public", "uploads", service.video.thumbnail);
          fs.unlink(thumbnailPath, err => {
            if (err) console.error(`Error deleting service thumbnail ${service.video.thumbnail}:`, err);
          });
        }
      }
      await Service.deleteOne({ _id: website.service });
    }
    if (website.footer) {
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
