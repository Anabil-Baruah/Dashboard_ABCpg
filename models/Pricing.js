const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Single Occupancy Studios"
  heading: { type: String, required: true },
  subHeading: { type: String },
  priceLists: [{
    title: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "₹" },
    duration: { type: String, default: "mo" },
    icon: { url: { type: String }, backgroundColor: { type: String } },
  }],
  features: [{ type: String }], // List of included features
  
});

module.exports = mongoose.model("Pricing", PricingSchema);
