const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    img: { type: String, required: false},
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
})

module.exports = mongoose.model('Gallery', gallerySchema);