const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorizeUser,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

// CREATE CART: Any user can create it's cart. That's why we only want to verify it's token.
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    return res.send(savedCart);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// UPDATE CART: User can change it's own cart. That's why we need to authorize the user with it's token.
router.put("/:id", verifyTokenAndAuthorizeUser, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ); // new: true will return the updated cart

    return res.send(updatedCart);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// DELETE CART:
router.delete("/:id", verifyTokenAndAuthorizeUser, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.send("Cart deleted successfully");
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET USER CART: User can get only it's own cart details.
router.get("/find/:userId", verifyTokenAndAuthorizeUser, async (req, res) => {
  try {
    // Note: We haven't used findById() here. Because, the id is not our cart id instead it's a userId.
    // The findOne() method is used because every user is going to have only one cart.
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.send(cart);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET ALL CARTS: Only admin can see all carts of all the users.
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    carts = await Cart.find();
    res.send(carts);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

module.exports = router;
