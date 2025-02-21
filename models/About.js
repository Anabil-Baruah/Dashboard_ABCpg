const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
    title: { type: String, required: true },        //Website that brings leads
    heading: { type: String, required: true },      //Why Choose ABC PG?
    features: [{
        icon: { type: String },
        title: { type: String },
        description: { type: String },
        backgroundColor: { type: String },
    }],
});

module.exports = mongoose.model("About", AboutSchema);
