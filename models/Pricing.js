const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "Single Occupancy Studios"
  price: { type: Number, required: true },
  currency: { type: String, default: "₹" },
  duration: { type: String, default: "mo" }, // e.g., per month, per year
  features: [{ type: String }], // List of included features
  icon: { type: String }, // URL or icon class for UI representation
});

module.exports = mongoose.model("Pricing", PricingSchema);
