const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const gymSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  official: {
    type: Boolean,
    defaault: false,
  },
  price: {
    type: Number,
    required: [true, "Invalid Price"],
    min: [0, "Minimum price is 0"],
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  image: {
    type: String,
    default: "https://source.unsplash.com/1600x900/?gym,garage",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
gymSchema.post("findOneAndDelete", async (gym) => {
  if (gym) {
    Review.deleteMany({
      _id: {
        $in: gym.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Gym", gymSchema);
