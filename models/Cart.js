const mongoose = require("mongoose");

// Creating user schema
const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// Creating user model
module.exports = mongoose.model("Cart", cartSchema); // modelname, schema
