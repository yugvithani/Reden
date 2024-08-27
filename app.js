const express = require('express')
const mongoose = require('mongoose')


const app = express()
const userRoutes = require("./routes/user-routes");
const contactRoutes = require("./routes/contact-routes");
const msgRoutes = require("./routes/msg-routes");
const groupRoutes = require("./routes/group-routes");
const directMsgRoutes = require("./routes/directMsg-routes");

const HttpError = require("./models/http-error");

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", msgRoutes);
app.use("/api", groupRoutes);
app.use("/api", directMsgRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose.connect(
    "mongodb+srv://yugvithani:yugvithani@mern.50tcxbl.mongodb.net/?retryWrites=true&w=majority&appName=mern" 
  )
  .then(() => {
    app.listen(3000);
    console.log("Mongo is connect.")
  })
  .catch((err) => {
    console.log(err);
  });