const express = require("express");
const router = express.Router();
const {Inventory} = require("../model/inventory.model");
const authenticateRole=require("../authenticate.js");
router.post("/all-inventories",authenticateRole("Customer"), async (req, res) => {
  try {
    const inventories = await Inventory.find({ quantity: { $gt: 0 } }).lean().exec();
    return res.send(inventories);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
router.post("/all-inventories-list",authenticateRole("Manager"), async (req, res) => {
  try {
    const inventories = await Inventory.find().lean().exec();
    return res.send(inventories);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
router.post("/all-inventories-list/:productId",authenticateRole("Manager"), async (req, res) => {
  try {
    const _id = req.params.productId;
    const inventories = await Inventory.findById(_id).lean().exec();
    return res.send(inventories);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

router.post('/add-product',authenticateRole("Manager"), async (req, res) => {
  try {
      const { name, image, description, weight, quantity, price } = req.body;

      const newProduct = new Inventory({
          name,
          image,
          description,
          weight,
          quantity,
          price
      });

      await newProduct.save();

      res.json({ message: 'Product added to inventory successfully', product: newProduct });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/update-product/:productId',authenticateRole("Manager"), async (req, res) => {
  try {
      const productId = req.params.productId;
      console.log("productId",productId)
      const product = await Inventory.findByIdAndUpdate(
          productId,
          req.body,
          { new: true }
      );

      if (!product) {
          return res.status(404).json({ message: 'Product not found in the inventory' });
      }

      res.json({ message: 'Product quantity updated successfully', product });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
