const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: { type: String },        //Amenities
    heading: { type: String },      //What we offer
    backgroundImage: { type: String },
    description: {
        type: String,
        trim: true
    },
    features: [{ type: String }], // List of included features
    card:[{
        icon: { url: { type: String }, backgroundColor: { type: String } },  
        title: { type: String },
    }],
    video: { url: { type: String }, thumbnail: { type: String } },
});

module.exports = mongoose.model('Service', ServiceSchema);