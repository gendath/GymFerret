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
app.get("/gym",async (req,res)=>{
    const gym = new Gym({
        name:"Perry's Garage",
        price: 10.99,
        description:"A dirt, nasty garage. Free tetanus with every visit!"

    })
    await gym.save()
    res.send("Gym")
})






app.listen(3000,()=>console.log("Server running on port 3000"))