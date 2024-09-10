const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const msgRoutes = require("./routes/msgRoutes");
const groupRoutes = require("./routes/groupRoutes");
const directMsgRoutes = require("./routes/directMsgRoutes");

const HttpError = require("./models/http-error");

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/msg", msgRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/directMsg", directMsgRoutes);

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
    process.env.atlas 
  )
  .then(() => {
    app.listen(3000);
    console.log("Mongo is connect.")
  })
  .catch((err) => {
    console.log(err);
  });