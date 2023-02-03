const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }
});

module.exports = mongoose.model('Favourite', favouriteSchema);
