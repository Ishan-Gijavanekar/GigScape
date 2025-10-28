import dotenv from dotenv;
dotenv.config();
import express from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import { connectDb } from './utils/database';
import {app, server} from "./utils/srever.js"


const port = process.env.PORT;


app.use(express.json());
app.use(cors());
app.use(CookieParser());
app.use(express.urlencoded({ extended: true }));

// Import Routes
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/category.js";
import chatRoomRoutes from "./routes/chatRoom.js";
import contractRoutes from "./routes/contract.js";
import jobRoutes from "./routes/job.js";
import messageRoutes from "./routes/message.js";

// User Routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/chatRooms", chatRoomRoutes)
app.use("/api/v1/contracts", contractRoutes)
app.use("/api/v1/jobs", jobRoutes)
app.use("/api/v1/messages", messageRoutes)



server.listen(port, () => {
    connectDb();
    console.log(`Example app listening on port ${port}`)
})