const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: null
    },
    addresses: [{
      street: String,
      city: String,
      state: String,
      country: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
