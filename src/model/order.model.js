const mongoose =require("mongoose");
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'inventory' },
        quantity: Number
    }],
    orderDate: { type: Date, default: Date.now },
    status: {type:[{type:String}],default: ['Processing']},
});

module.exports={Order:mongoose.model('order', orderSchema),orderSchema};
