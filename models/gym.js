const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gymSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    official:{
            type: Boolean,
            defaault:false
        },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String
    }
    }
)

module.exports = mongoose.model("Gym",gymSchema)