const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: { type: String, required: true },
    buyer: { type: String, required: true },
    seller: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Message', messageSchema);
