const {Schema,model}=require("mongoose");
const inventorySchema=new Schema({
    name: String,
    image: String,
    description: String,
    weight: Number,
    quantity: Number,
    price: Number
},{
    versionKey:false,
    timestamps:true
});
module.exports ={Inventory:model("inventory",inventorySchema),inventorySchema};
