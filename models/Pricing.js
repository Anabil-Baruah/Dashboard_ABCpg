const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
  title: { type: String }, // e.g., "Single Occupancy Studios"
  heading: { type: String },
  subHeading: { type: String },
  priceLists: [{
    title: { type: String },
    price: { type: Number },
    currency: { type: String, default: "₹" },
    duration: { type: String, default: "mo" },
    icon: { url: { type: String }, backgroundColor: { type: String } },
  }],
  features: [{ type: String }], // List of included features
  
});

module.exports = mongoose.model("Pricing", PricingSchema);
