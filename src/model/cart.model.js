const {Schema,model}=require("mongoose");
 const cartSchema=new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'inventory' },
    quantity: Number
},{
    versionKey:false,
    timestamps:true
});
module.exports ={Cart:model("cart",cartSchema),cartSchema};
