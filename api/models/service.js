const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
})

module.exports = mongoose.model('Service', serviceSchema);