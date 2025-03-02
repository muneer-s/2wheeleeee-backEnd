"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = exports.app = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
// initialize Socket.IO
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true,
    },
});
exports.io = io;
let activeUsers = [];
// Socket.IO Connections
io.on("connection", (socket) => {
    console.log('a user connected', socket.id);
    socket.on("setup", (userId) => {
        socket.join(userId);
        socket.emit("connected");
        if (!activeUsers.some((user) => user.userId === userId)) {
            activeUsers.push({ userId: userId, socketId: socket.id });
        }
        io.emit('get-users', activeUsers);
    });
    // joining a chat
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined Room: ", room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    // sending messages
    socket.on("message", (message) => {
        console.log("Message received:", message);
        let chat = message.chat;
        if (!chat.users)
            return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            console.log(1, user);
            console.log(2, message.sender._id);
            if (user._id !== message.sender._id) {
                console.log(98, message);
                socket.to(user._id).emit("message received", message); // send the message to others
            }
        });
    });
    // handling disconnection
    socket.on("disconnect", () => {
        console.log("user disconnected");
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit('get-users', activeUsers);
    });
    socket.on("offline", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit('get-users', activeUsers);
    });
});
