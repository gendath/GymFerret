const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body:{
        type:String,
        required: true
    },
    rating:{
        type:Number,
        required:[true,"Rating is Required"],
        min:[0,"Minimum Rating is 1"],
        max:[5,"Rating cannot exceed 5"]
    },
    }
)


module.exports = mongoose.model("Review",reviewSchema)