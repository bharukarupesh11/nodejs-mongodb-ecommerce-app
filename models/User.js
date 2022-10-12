const mongoose = require("mongoose");

// Creating a user schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Creating a user model
module.exports = mongoose.model("User", userSchema); // modelname, schema
