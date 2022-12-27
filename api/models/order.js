const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true},
    buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true},
    status: {type: String, required: true}

})

module.exports = mongoose.model('Order', orderSchema);