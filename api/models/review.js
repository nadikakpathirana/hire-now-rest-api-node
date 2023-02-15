const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    buyer: { type: String, required: true },
    seller: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, min: 0, max: 7, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
