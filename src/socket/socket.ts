import { Server } from "socket.io";  // Enables real-time bidirectional event-based communication
import { createServer } from "http";  //  Creates an HTTP server for WebSockets.
import express from "express"; //Web framework for handling HTTP requests.

const app = express();
const server = createServer(app);  // Creates an HTTP server using createServer(app) (required for Socket.IO).

// Initialize Socket.IO
const io = new Server(server, {    // io is the Socket.IO server.
  pingTimeout: 60000,   // Disconnects users if no ping is received for 60s
  cors: {     // Allows cross-origin requests from FRONTEND_URL (React, Vue, etc.)
    //origin: [process.env.FRONTEND_URL || ''],
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ["GET", "POST"],    // Allows only GET and POST requests.
    credentials: true,
  },
}); 


// Defines a TypeScript interface for active users.
interface ActiveUsersType{  
    userId:string;
    socketId:string;
}
 
// activeUsers stores an array of connected users.
let activeUsers = [] as ActiveUsersType[]


// 5️⃣ Handling Socket.IO Connections

io.on("connection", (socket) => {
  // console.log('a user connected',socket.id);
  socket.on("setup", (userId) => {      // User Setup (Joining)
    socket.join(userId);           
    socket.emit("connected"); 
    
    if(!activeUsers.some((user) => user.userId === userId)){
      activeUsers.push({userId:userId,socketId:socket.id})
    }
    io.emit('get-users',activeUsers) 

  });
  //User joins their unique room (socket.join(userId)).
  //Emits "connected" to confirm the connection.
  //Adds user to activeUsers (if not already in the list).
  //Broadcasts the updated active user list to all users (io.emit('get-users', activeUsers)) so everyone knows who is online.




// Joining a Chat Room
  socket.on("join chat", (room) => {   // Users can join a chat room by emitting "join chat" with the room ID.
    socket.join(room);
  }); 


  // Sending Messages
//   socket.on("message", (message) => { 
//     let chat = message.chat
//     chat.users.forEach((user:any)=>{
//         if(user === message.sender._id) return
        
//         socket.in(user).emit("message received",message)
        
//     })
//   });


  socket.on("message", (message) => {
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
    // console.log("user disconnected");
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
    io.emit('get-users',activeUsers)
  });

// When a user disconnects, remove them from activeUsers.
// Broadcasts updated user list to all connected clients.



// Handling Manual Offline Status
  socket.on("offline",() => { 
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
    io.emit('get-users',activeUsers)
  })
}); 

// If a user manually goes offline (socket.emit("offline") from the frontend):
//        - Removes the user from activeUsers.
//        - Broadcasts the updated user list.




export { app, io, server };


// app: Express instance (useful if you want to add API routes).
// io: Socket.IO instance.
