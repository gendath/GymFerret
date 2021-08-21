const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const gymRoutes = require("./routes/gyms");
const appError = require("./utils/appError.js");

mongoose.connect("mongodb://localhost:27017/GJJFinder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("useFindAndModify", false);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected");
});
const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", gymRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "static")));

app.all("*", (req, res, next) => {
  next(new appError("404-Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Something Went Wrong";
  }
  res.status(status).render("error", { err });
});

app.listen(3000, () => console.log("Server running on port 3000"));
