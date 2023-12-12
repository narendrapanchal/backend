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
app.use("/users",(req, res, next) => {
    // Allow any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
    // Allow specific HTTP headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Allow credentials (if applicable)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
    // Continue to the next middleware or route handler
    next();
  },crudUser);
app.use("/inventory",crudInventory);
app.use("/cart",crudCart);
app.use("/order",crudOrder);

const __dirname1=path.resolve();



app.listen(8000,async()=>{
    await connect();
    console.log(8000 , "port");
})