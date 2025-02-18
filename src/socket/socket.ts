import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);

// initialize Socket.IO
const io = new Server(server, {    // io is the Socket.IO server.
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// 5️⃣ Handling Socket.IO Connections

io.on("connection", (socket) => {
    console.log('a user connected', socket.id);

    socket.on("setup", (userId) => {      // User Setup (Joining)
        socket.join(userId);
        socket.emit("connected");

    });

    // Sending Messages
    socket.on("message", (message) => {
        console.log("Message received:", message);

        let chat = message.chat;
        chat.users.forEach((user: any) => {
            if (user._id !== message.sender._id) {
                socket.to(user._id).emit("message received", message);
            }
        });
    });

    // When a message is sent:
    // Extracts chat from the message.
    // Loops through chat.users and sends the message only to users except the sender (socket.in(user).emit("message received", message)).


    // Handling Disconnection
    socket.on("disconnect", () => {
        console.log("user disconnected");

    });

});


export { app, io, server };