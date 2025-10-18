import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Local Imports ---
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import listingRoutes from './routes/listingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// --- Configuration ---
dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- App Initialization ---
const app = express();
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/messages', messageRoutes); // Use the correct message routes

// --- Static Folder for Uploads ---
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Server and WebSocket Setup ---
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both CRA and Vite ports
    methods: ["GET", "POST"],
  },
});

// --- Real-Time Logic for Online Users ---
const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Send the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
    }
    // Update the list of online users for all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export io and server for use in other files
export { app, io, server };