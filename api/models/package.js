const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    title: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    description: { type: String, required: true },
    charges: { type: Number, min: 0, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Package', packageSchema);
