const mongoose = require("mongoose");

// Creating user schema
const orderSchema = new mongoose.Schema(
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
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // after making a payment stripe library will return us an object. Also, the address will have line1, line2, city, state and so we want the entire object in the address field
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

// Creating user model
module.exports = mongoose.model("Order", orderSchema); // modelname, schema
