const router = require("express").Router();
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const product = new Product(req.body);

  try {
    const savedProduct = await product.save();
    return res.send(savedProduct);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ); // new: true will return the updated product

    return res.send(updatedProduct);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// DELETE PRODUCT:
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Product deleted successfully");
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET PRODUCT: Everybody can see the products. So this will be a public API(No authentication and no authorization).
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET ALL PRODUCTS: Everybody can see the list of all products. So this will be a public API(No authentication and no authorization).
router.get("/", async (req, res) => {
  try {
    const qNew = req.query.new; // Fetch all products by created at date
    const qCategory = req.query.category; // Fetch all products by category

    let products; // this is an array

    if (qNew) {
      // -1 will sort the records in descending order based on the given field(createdAt)
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      // the in operaor checks whether the provided category query string exists inside the categories array of every product record or not. And, it returns the matching products array of provided category.
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.send(products);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

module.exports = router;
