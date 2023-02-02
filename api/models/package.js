const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    sellerID: { type: String, required: true },
    serviceID: { type: String, required: true },
    description: { type: String, required: true },
    charges: { type: Number, min: 0, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Package', packageSchema);
