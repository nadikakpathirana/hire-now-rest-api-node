const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

});

module.exports = mongoose.model('Cart', cartSchema);
