const mongoose = require("mongoose");

const WebsiteSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Website Name
  websiteThemeColor:{type: String, default:"#000000"}, // Website Theme Color
  home: { type: mongoose.Schema.Types.ObjectId, ref: "Homepage" },
  pricing: { type: mongoose.Schema.Types.ObjectId, ref: "Pricing" },
  about: { type: mongoose.Schema.Types.ObjectId, ref: "About" },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  footer: { type: mongoose.Schema.Types.ObjectId, ref: "Footer" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Website", WebsiteSchema);
