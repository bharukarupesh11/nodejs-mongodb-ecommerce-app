const mongoose = require("mongoose");

// Creating user schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

// Creating user model
module.exports = mongoose.model("Product", productSchema); // modelname, schema
