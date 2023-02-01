const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    address: { type: String, required: true},
    dob: { type: String, required: true},
    country: { type: String, required: true},
    password: { type: String, required: true},
    phoneNumber: { type: String, required: true},
    userType: { type: String, default: "buyer", required: false},
    isSellerActivated: {type: Boolean, default: false, required: false}
})

module.exports = mongoose.model('User', userSchema);