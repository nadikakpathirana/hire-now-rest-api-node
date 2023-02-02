const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    buyerID: { type: String, required: true },
    sellerID: { type: String, required: true },
    amount: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Payment', paymentSchema);
