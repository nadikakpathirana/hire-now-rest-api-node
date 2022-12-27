const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('Seller', sellerSchema);