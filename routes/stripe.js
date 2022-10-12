const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // The stripe package needs to be configured using secret key which is available in stripe dashboard

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "INR",
    },
    (stripeError, stripeResponse) => {
      if (stripeError) {
        res.send(stripeError);
      } else {
        res.send(stripeResponse);
      }
    }
  );
});
module.exports = router;
