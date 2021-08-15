const express = require("express")
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejsMate = require("ejs-mate")
const appError = require("./appError")


function  wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{
            next(err)
        })
    }
}
mongoose.connect("mongodb://localhost:27017/GJJFinder",{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("DB connected")
})
const app = express()

const Gym = require("./models/gym")

app.engine("ejs",ejsMate)
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")


app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use((req,res,next)=>{
    console.log("custom",req.method,req.path,res.statusCode)
    next()
})
app.use(express.static(path.join(__dirname,"static")))

const addGym = async (newGym)=>{
    const {name,description,price,location,image} = newGym
    const gym = new Gym({name,description,price,location,image})
    try{
        await gym.save()
    }catch(e){
        console.log("ERROR")
    }
    return gym
}


app.get("/",(req,res)=>{
    res.render("home")
})

//List Gyms
app.get("/gyms",wrapAsync(async (req,res,next)=>{
    const gyms = await Gym.find({})
     res.render("gyms/index",{gyms})
}))
//add new Gym
app.post("/gyms",wrapAsync(async (req,res)=>{
    const gym = await addGym(req.body.gym)
    res.redirect(`/gyms/${gym.id}`)
}))
//show new Gym form
app.get("/gyms/new",(req,res)=>{
     res.render("gyms/new")
})

//Show Gym Details
app.get("/gyms/:id",wrapAsync(async (req,res,next)=>{

        const {id} = req.params
        const gym = await Gym.findById(id)
        if (!gym){
          throw new appError("Unable to find rquested gym",404)
        }
    
            res.render("gyms/show",{gym})

     
}))
//Upgate Gym 
app.put("/gyms/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params
    const {name,description,price,location} = req.body.gym
    const gym = await Gym.findByIdAndUpdate(id,{name,description,price,location},{runValidators: true})
     
    if (gym) {
        res.redirect(`/gyms/${gym.id}`)
    }else{
        res.send("unable to edit")

    }
}))
app.delete("/gyms/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params
    const gym = await Gym.findByIdAndDelete(id)
     
    if (gym) {
        res.redirect(`/gyms`)
    }else{
        res.send("unable to Delete")

    }
}))
//Show Edit Form
app.get("/gyms/:id/edit",wrapAsync(async (req,res)=>{
    const {id} = req.params
    const gym = await Gym.findById(id)
     res.render("gyms/edit",{gym})
}))
app.use((req,res,next)=>{
    res.status(404).send("404 error")
})
app.use((err,req,res,next)=>{
    const {status=500,message="Something went wrong!"} = err
    res.status(status).send(message)
})





app.listen(3000,()=>console.log("Server running on port 3000"))