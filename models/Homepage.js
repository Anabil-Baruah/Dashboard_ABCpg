const mongoose = require("mongoose");

const NavbarSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    default: "ABC PG",
  },
  contact: {
    number: { type: String, required: true },
    status: { type: Boolean, default: true },
    link: { type: String },
  },
  about: { status: { type: Boolean, default: true } },
  services: { status: { type: Boolean, default: true } },
  team: { status: { type: Boolean, default: true } },
  pricing: { status: { type: Boolean, default: true } },
  blog: { status: { type: Boolean, default: true } },
});

const PageContentSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subheading: { type: String },
  buttonColor: { type: String},
  buttonText: { type: String },
  buttonLink: { type: String },
});

const HomepageSchema = new mongoose.Schema({
  navbar: NavbarSchema,
  content: PageContentSchema,
});

// Prevent model overwrite
const Homepage = mongoose.models.Homepage || mongoose.model("Homepage", HomepageSchema);

module.exports = Homepage;
