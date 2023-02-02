const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    serviceID: { type: String, required: true },
    buyerID: { type: String, required: true }
});

module.exports = mongoose.model('Favourite', favouriteSchema);
