const express = require("express")
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejsMate = require("ejs-mate")
const appError = require("./utils/appError")
const wrapAsync= require("./utils/wrapSync")
const {gymSchema, reviewSchema} = require("./schemas")



mongoose.connect("mongodb://localhost:27017/GJJFinder",{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("DB connected")
})
const app = express()

const Gym = require("./models/gym")
const Review = require("./models/review")

app.engine("ejs",ejsMate)
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")


app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

app.use(express.static(path.join(__dirname,"static")))

const addGym = async (newGym)=>{
    const {name,description,price,location,image} = newGym
    const gym = new Gym({name,description,price,location,image})
    await gym.save()
    return gym
}
 const validateGym = (req,res,next)=>{

    const {error} = gymSchema.validate(req.body)
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new appError(msg,400)}
        next()
 }
 const validateReview = async (req,res,next)=>{
     console.log(req.body)
    const {error} = reviewSchema.validate(req.body)
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new appError(msg,400)
    }
        next()
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
app.post("/gyms", validateGym,wrapAsync(async (req,res)=>{


    const gym = await addGym(req.body.gym)
    res.redirect(`/gyms/${gym.id}`)
}))
app.post("/gyms/:id/reviews", validateReview,wrapAsync(async (req,res)=>{
    const {id} = req.params
    const gym = await Gym.findById(id)
    const review  = new Review(req.body.review)
    gym.reviews.push(review)
    review.save()
    gym.save()
    res.redirect(`/gyms/${gym.id}`)
}))
//show new Gym form
app.get("/gyms/new",(req,res)=>{
     res.render("gyms/new")
})

//Show Gym Details
app.get("/gyms/:id",wrapAsync(async (req,res,next)=>{

        const {id} = req.params
        const gym = await Gym.findById(id).populate("reviews")
        if (!gym){
          throw new appError("Unable to find requested gym",400)
        }
            
            res.render("gyms/show",{gym})

     
}))
//Upgate Gym 
app.put("/gyms/:id",validateGym, wrapAsync(async (req,res)=>{
    const {id} = req.params
    const {error} = gymSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new appError(msg,400)}
    const {name,description,price,location} = req.body.gym
    const gym = await Gym.findByIdAndUpdate(id,{name,description,price,location},{runValidators: true})
     
    if (gym) {
        res.redirect(`/gyms/${gym.id}`)
    }else{
        res.send("unable to edit")

    }
}))

//TODO: currently can be used to delete any gym if ID is known. Need to fix
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

//TODO: need to limit ability to edit to owned gyms
app.get("/gyms/:id/edit",wrapAsync(async (req,res)=>{
    const {id} = req.params
    const gym = await Gym.findById(id)
     res.render("gyms/edit",{gym})
}))
app.all("*",(req,res,next)=>{
    next(new appError("404-Page Not Found",404))
})
app.use((err,req,res,next)=>{
    const {status=500} = err
    if(!err.message){
        err.message="Something Went Wrong"
    }
    res.status(status).render("error",{err})
})





app.listen(3000,()=>console.log("Server running on port 3000"))