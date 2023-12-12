const express=require("express");
const app=express();
const cors=require("cors");
const path=require("path")
app.use(express.json());
app.use(cors());
const connect =require("./configs/db");
const crudUser=require("./controller/user.controller");
const createUser=require("./controller/create.user.controller");
const crudInventory=require("./controller/inventory.controller");
const crudCart=require("./controller/cart.controller");
const crudOrder=require("./controller/order.controller");
const dotenv = require('dotenv');
dotenv.config();
app.use("/create",createUser);
app.use("/users",crudUser);
app.use("/inventory",crudInventory);
app.use("/cart",crudCart);
app.use("/order",crudOrder);

const __dirname1=path.resolve();



app.listen(8000,async()=>{
    await connect();
    console.log(8000 , "port");
})