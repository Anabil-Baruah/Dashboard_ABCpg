const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    // title: { type: String },       
    heading: { type: String },
    images: [{ type: String }],
});

module.exports = mongoose.model('Team', TeamSchema);