const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const { Server } = require('socket.io'); // Import Socket.IO
require('dotenv').config()

const app = express()

const http = require('http').createServer(app);

const userRoutes = require("./routes/userRoutes");
const msgRoutes = require("./routes/msgRoutes");
const groupRoutes = require("./routes/groupRoutes");

const HttpError = require("./models/http-error");

const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from localhost:3000
  methods: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/msg", msgRoutes);
app.use("/api/group", groupRoutes);

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

const io = new Server(http);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle incoming messages
  socket.on('sendMessage', (messageData) => {
    console.log('Message received:', messageData);
    io.emit('receiveMessage', messageData); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
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