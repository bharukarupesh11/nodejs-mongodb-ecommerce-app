const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productsRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

dotenv.config(); // load .env file contents into process.env

// Connecting with Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection successful..!!"))
  .catch((error) => console.log("Could not connect to database: ", error));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

// Running backend server on the given port
let port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
