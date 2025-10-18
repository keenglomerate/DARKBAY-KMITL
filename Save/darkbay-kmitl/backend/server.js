const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const listingRoutes = require('./routes/listingRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/conversations', messageRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

// WebSocket connection for real-time messaging
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User with ID: ${socket.id} joined conversation: ${conversationId}`);
  });

  socket.on("send_message", (data) => {
    // When a message is sent, emit it back to the users in that conversation room
    socket.to(data.conversationId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, console.log(`Server running on port ${PORT}`));