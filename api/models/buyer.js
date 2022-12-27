const mongoose = require('mongoose');

const buyerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('Buyer', buyerSchema);