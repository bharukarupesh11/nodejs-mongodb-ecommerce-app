const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorizeUser,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

// CREATE ORDER: Any user can place an order. That's why we only want to verify it's token.
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedCart = await newOrder.save();
    return res.send(savedCart);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// UPDATE ORDER: Only admin can update the orders
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ); // new: true will return the updated cart

    return res.send(updatedOrder);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// DELETE ORDER: Only admin can delete the order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.send("Cart deleted successfully");
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET USER ORDERS: User can get only it's own order details.
router.get("/find/:userId", verifyTokenAndAuthorizeUser, async (req, res) => {
  try {
    // Note: We haven't used findById() here. Because, the id is not our cart id instead it's a userId.
    // The find() method is used because the user can have more than one orders.
    const orders = await Order.findOne({ userId: req.params.userId });
    res.send(orders);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET ALL ORDERS: Only admin can see all orders of all the users.
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    orders = await Order.find();
    res.send(orders);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET MONTHLY INCOME STATS
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date(); //
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1)); //
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)); //

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.send(income);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

module.exports = router;
