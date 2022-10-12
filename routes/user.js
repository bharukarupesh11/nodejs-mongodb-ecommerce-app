const router = require("express").Router();
const CryptoJs = require("crypto-js");
const User = require("../models/User");
const {
  verifyTokenAndAuthorizeUser,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

// API to update the user
router.put("/:id", verifyTokenAndAuthorizeUser, async (req, res) => {
  // if user is updating password then encrypt the new password again
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ); // new: true will return the updated user

    return res.send(updatedUser);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// DELETE USER: User can delete it's own account, that's why verifyTokenAndAuthorizeUser() is used
router.delete("/:id", verifyTokenAndAuthorizeUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted successfully");
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET User Stats: Total number of users created per month
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date(); // Current Date: 2022-09-27T19:25:14.333Z
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); // Last Year: 2021-09-27T19:25:14.333Z

  try {
    // To get the user stats per month we need to group the items and for that we use mongodb aggregate
    // Here, we're saying
    // 1. match all the records createdAt field which should be greater than or equal to lastYear
    // 2. Extract the month from the createdAt field. Eg. 9(september), 8(august) etc.
    // 3. Group the total records in that month. Sum will do the addition of each record in that month.
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET USER: Only admin user can see the details of any specific user
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc; // Extracting password from the user object by obj destructuring and sending only the info other than password in the response
    res.send(others);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

// GET ALL USERS: Only admin user can see the details of any specific user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();

    res.send(users);
  } catch (error) {
    console.log("Error: ", error);
    return res.send(error);
  }
});

module.exports = router;
