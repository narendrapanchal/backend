const {Schema,model}=require("mongoose");
const {cartSchema}=require("./cart.model")


const userSchema=new Schema({
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    address: String,
    password: String,
    role: { type: String, enum: ['Customer', 'Manager','Admin'] },
    cart:[cartSchema]
},{
    versionKey:false,
    timestamps:true
});
module.exports ={User:model("user",userSchema),userSchema};


