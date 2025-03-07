const mongoose = require("mongoose");

const FooterSchema = new mongoose.Schema({
    heading: { type: String },
    subHeading: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    socials: {
        instagram: { type: String },
        facebook: { type: String },
        x: { type: String }
    }
});

module.exports = mongoose.model("Footer", FooterSchema);
