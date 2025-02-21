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


interface ActiveUsersType {
    userId: string;
    socketId: string;
}

let activeUsers = [] as ActiveUsersType[]

// handling Socket.IO Connections
io.on("connection", (socket) => {
    console.log('a user connected', socket.id);

    socket.on("setup", (userId) => {      // user setup (joining) this will take user data from front end
        socket.join(userId);  // creating a room for that perticular user only
        socket.emit("connected");
        if (!activeUsers.some((user) => user.userId === userId)) {
            activeUsers.push({ userId: userId, socketId: socket.id })
        }
        io.emit('get-users', activeUsers)
    });

    // joining a chat
    socket.on("join chat", (room) => { // take room id from front end
        socket.join(room);
        console.log("user joined Room: ", room);
    });  // when we click on any chat then this new room will create with that person



    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))



    // sending messages
    socket.on("message", (message) => {
        console.log("Message received:", message);

        let chat = message.chat;

        if (!chat.user) return console.log("chat.users not defined");

        chat.users.forEach((user: any) => {
            if (user._id !== message.sender._id) {
                socket.to(user._id).emit("message received", message); // send the message to others
            }
        });
    });

    // handling disconnection
    socket.on("disconnect", () => {
        console.log("user disconnected");
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users', activeUsers)
    });

    socket.on("offline", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users', activeUsers)
    })


});


export { app, io, server };