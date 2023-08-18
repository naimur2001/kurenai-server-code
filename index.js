require("dotenv").config()
const express=require("express");
const cors=require("cors")
const app=express();
const port=process.env.PORT || 5000;


// middleware
app.use(express.json())
app.use(cors())
// basic get method
app.get('/',(req,res)=>{
  res.send('Banao Server is Running')
})
app.listen(port,()=>{
  console.log(`Server Port is : ${port}`)
})