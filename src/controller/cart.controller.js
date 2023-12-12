const express = require("express");
const router = express.Router();
const {Cart} = require("../model/cart.model");
const {Inventory} = require("../model/inventory.model");
const {User} = require("../model/user.model");
const {Order}= require("../model/order.model");
const authenticate=require("../authenticate");
router.get('/user-cart',authenticate("Customer"), async (req, res)=> {
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
    console.log(req.body,product.quantity,"product.quantity")
    if(!product && quantity<=product.quantity){
      return res.status(422).json({ message: 'Insufficient quantity in the inventory' });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

     // Add the product to the user's cart
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
// router.post('/place-order', async (req, res) => {

//   try {
//       const userId = req.user.userId;

//       const user = await User.findById(userId).populate('cart.productId');

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       const orderItemsMap = user.cart.map(item => ({
//           [item.productId]: item.quantity
//       }));

//       const inventoryItems = await Inventory.find({ _id: { $in: Object.keys(orderItemsMap) } });
//       inventoryItems.forEach(async(element)=>{
//         if(element.quantity>=orderItemsMap[element.productId]){
//            element.quantity-=orderItemsMap[element.productId];
//            await element.save({ session });
//         }else{
//           return res.status(422).json({ message: 'Insufficient quantity in the inventory' });
//         }
//       })
//       // You might want to perform additional checks and validations before placing an order

//       // Create an order
//       const order = new Order({
//           userId: userId,
//           items: user.cart.map((item)=>({
//             productId:item.productId._id,
//             quantity:item.quantity
//           })),
//           orderDate: new Date(),
//           status: 'Processing'
//       });

//     // Save the order to the database
//     await order.save({ session });

//       // Save the order to the database
//       // Assuming you have an 'Order' model
//       // const newOrder = new Order(order);
//       // await newOrder.save();

//       // Clear the user's cart
//       user.cart = [];
//       await user.save({ session });
//       await session.commitTransaction();
//       session.endSession();
//       res.json({ message: 'Order placed successfully', order });
//   } catch (error) {
//       console.error(error);
//       await session.abortTransaction();
//         session.endSession();
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
module.exports = router;
