import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import {Server} from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'PUT', "DELETE", 'PATCH'],
    },
})

app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on("connection", (socket) => {
    console.log(`User connected with socket id: ${socket.id}`);

    socket.on("joinRoom", (roomId) =>{
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    })

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    })

    socket.on("sendMessage", (messageData) => {
        const {room, message} = messageData;
        io.to(room).emit("newMessage", messageData);
        console.log(`Message in ${room}: ${message}`);
    })

    socket.on("typing", ({roomId, userId}) => {
        socket.to(roomId).emit("userTyping", {userId});
    })

    socket.on("markRead", ({roomId, userId, messageIds}) => {
        io.to(roomId).emit("messagesRead", {userId, messageIds});
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected with socket id: ${socket.id}`);
    })
})

export {app, server};