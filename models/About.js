const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
    title: { type: String },        //Website that brings leads
    heading: { type: String },      //Why Choose ABC PG?
    features: [{
        title: { type: String },
        description: { type: String },
    }],
});

module.exports = mongoose.model("About", AboutSchema);
