const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: { type: String },        //Amenities
    heading: { type: String },      //What we offer
    description: {
        type: String,
        trim: true
    },
    features: [{ type: String }], // List of included features
    card:[{
        title: { type: String },
    }],
    video: { url: { type: String }, thumbnail: { type: String } },
});

module.exports = mongoose.model('Service', ServiceSchema);