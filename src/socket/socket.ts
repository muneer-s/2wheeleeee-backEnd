import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);

// initialize Socket.IO
const io = new Server(server, {    // io is the Socket.IO server.
    pingTimeout: 60000, // if 60 seconds user didnt send any messges . then it gonna closa the connect and save the bandwidth
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true,
    },
});


interface ActiveUsersType{
    userId:string;
    socketId:string;
}

let activeUsers = [] as ActiveUsersType[]


// 5️⃣ Handling Socket.IO Connections

io.on("connection", (socket) => {
    console.log('a user connected', socket.id);

    socket.on("setup", (userId) => {      // User Setup (Joining)
        socket.join(userId);
        socket.emit("connected");
        if(!activeUsers.some((user) => user.userId === userId)){
            activeUsers.push({userId:userId,socketId:socket.id})
          }
          io.emit('get-users',activeUsers) 
    });

    socket.on("join chat", (room) => {
        socket.join(room);
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
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users',activeUsers)
      });

      socket.on("offline",() => { 
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users',activeUsers)
      })

});


export { app, io, server };