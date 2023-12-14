const express = require("express");
const router = express.Router();
const { User } = require("../model/user.model");
const { Order } = require("../model/order.model");
const { Inventory } = require("../model/inventory.model");
const authenticateRole = require("../authenticate");
router.post("/place-order", authenticateRole("Customer"), async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.cart.length < 1) {
      return res.status(404).json({ message: "No product found" });
    }
    let mapInventory = {};
    {

      user.cart.forEach((ele) => {
        if (mapInventory[ele.productId._id] == null) {
          mapInventory[ele.productId._id] = {
            availableQuantity: ele.productId.quantity,
            requireQuantity: ele.quantity,
          };
        } else {
          mapInventory[ele.productId._id] = {
            ...mapInventory[ele.productId._id],
            requireQuantity: mapInventory[ele.productId._id].requireQuantity + ele.quantity,
          };
        }
      });
      for (k in mapInventory) {
        if (
          mapInventory[k].availableQuantity < mapInventory[k].requireQuantity
        ) {
          return res
            .status(422)
            .json({ message: "Insufficient quantity in the inventory" });
        }
    }
    }
    const orderItems = user.cart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    const order = new Order({
      userId: userId,
      items: orderItems,
      status: "Processing",
    });
    Object.keys(mapInventory).forEach(async (ele) => {
      const inventory = await Inventory.findById(ele);
      
        inventory.quantity -= mapInventory[ele].requireQuantity;
        await inventory.save();
      
    });

    await order.save();

    user.cart = [];
    await user.save();

    return res.json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/all-orders", authenticateRole("Manager"),async (req, res) => {
  try {
    const orders = await Order.find().sort({orderDate:-1})
      .populate("items.productId");
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put('/update-order-status/:orderId', authenticateRole("Manager"), async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            orderId,
            { $push: { status: status } },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/orders/',authenticateRole("Customer"), async (req, res) => {
    try {
      const userId = req.user.userId;

        const orders = await Order.find({ userId }).populate('items.productId').sort({orderDate:-1});

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the specified user' });
        }

        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
