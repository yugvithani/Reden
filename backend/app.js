const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io'); // Import Socket.IO
require('dotenv').config();
const path = require('path');
const Message = require('./models/msg');

const app = express();

const http = require('http').createServer(app);

const userRoutes = require("./routes/userRoutes");
const msgRoutes = require("./routes/msgRoutes");
const groupRoutes = require("./routes/groupRoutes");

const HttpError = require("./models/http-error");

const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from localhost:5173
  methods: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Socket.IO
const io = new Server(http, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials if necessary
  }
});

// Attach socket.io instance to the app, so it can be accessed from other files
app.set('socketio', io);

// Handle socket connections
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ userId }) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('sendMessage', (messageData) => {
    console.log('Sending message:', messageData);
    io.to(messageData.receiver.toString()).emit('receiveMessage', messageData);
    // Only emit to sender if it's not the same as receiver
    if (messageData.sender !== messageData.receiver) {
      io.to(messageData.sender.toString()).emit('receiveMessage', messageData);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/user", userRoutes);
app.use("/api/msg", msgRoutes);
app.use("/api/group", groupRoutes);

// Fallback route for 404
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

// Error handling middleware
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
    http.listen(3000);
    console.log("Mongo is connect.")
  })
  .catch((err) => {
    console.log(err);
  });