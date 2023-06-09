const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    set: (value) => {
      if (value === "") {
        return undefined;
      }
      return value;
    },
  },
  description: {
    type: String,
    required: true,
    set: (value) => {
      if (value === "") {
        return undefined;
      }
      return value;
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceImg: {
    type: String,
    required: true,
    set: (value) => {
      if (value === "") {
        return undefined;
      }
      return value;
    },
  },
  isP: { type: Boolean, required: false, default: false },
  rateOfPayment: { type: String, required: false, default: "negotiable" },
  price: { type: Number, required: false, default: 0 },
});

module.exports = mongoose.model("Service", serviceSchema);
