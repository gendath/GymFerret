const express = require("express")
const path = require("path")
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/GJJFinder",{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("DB connected")
})
const app = express()

const Gym = require("./models/gym")


app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")




app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/gyms",async (req,res)=>{
    const gyms = await Gym.find({})
     res.render("gyms/index",{gyms})
})
app.get("/gyms/new",async (req,res)=>{
     res.send("Gym")
})
app.get("/gyms/:id",async (req,res)=>{
    const {id} = req.params
    const gym = await Gym.findById(id)
     res.render("gyms/show",{gym})
})
app.get("/gyms/:id/edit",async (req,res)=>{
     res.send("Gym")
})






app.listen(3000,()=>console.log("Server running on port 3000"))