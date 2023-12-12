const mongoose=require("mongoose");
module.exports=()=>{
    return mongoose.connect("mongodb+srv://narendra1:narendra1@cluster0.fcwxv.mongodb.net/eagle");
}