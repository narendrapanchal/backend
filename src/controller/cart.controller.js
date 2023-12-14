const express = require("express");
const router = express.Router();
const {Inventory} = require("../model/inventory.model");
const {User} = require("../model/user.model");
const authenticate=require("../authenticate");
router.post('/user-cart',authenticate("Customer"), async (req, res)=> {
  try {
      const userId = req.user.userId;
      const user = await User.findById(userId).populate('cart.productId');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ cart: user.cart });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/add-to-cart/:productId",authenticate("Customer"), async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;
    const quantity = req.body.quantity || 1;
    const product = await Inventory.findById(productId);
    if(!product && quantity<=product.quantity){
      return res.status(422).json({ message: 'Insufficient quantity in the inventory' });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
     user.cart.push({ productId, quantity });
     await user.save();
     res.json({ message: 'Item added to the cart successfully' });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

router.put("/update-cart/:productId",authenticate("Customer"), async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const user = await User.findById(userId).populate("cart.productId");
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(item => item._id == productId);

    if (!cartItem) {
      console.log("cartItem")
      return res.status(404).json({ message: 'Item not found in the cart' });
      }
      if(cartItem.productId.quantity<quantity){
        return res.status(422).json({ message: 'Insufficient quantity in the inventory' });
    }
    cartItem.quantity = quantity;
    await user.save();

    res.json({ message: 'Cart item quantity updated successfully' });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});


module.exports = router;
