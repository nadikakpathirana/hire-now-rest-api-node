const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true},
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true},
    service: {type:mongoose.Schema.Types.ObjectId, ref: 'Service', required: true},
    status: {type: String, default:"pending", required: false},
    message: {type: String, required: false}

})

module.exports = mongoose.model('Order', orderSchema);