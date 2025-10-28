import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import { connectDb } from './utils/database.js';
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
import milestoneRoutes from "./routes/milestone.js";
import praposalRoutes from "./routes/praposal.js";
import quizRoutes from "./routes/quiz.js";
import quizAttemptRoutes from "./routes/quizAttempt.js";
import reviewRoutes from "./routes/review.js";
import transactionRoutes from "./routes/transaction.js";
import walletRoutes from "./routes/wallet.js";

// User Routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/chatRooms", chatRoomRoutes)
app.use("/api/v1/contracts", contractRoutes)
app.use("/api/v1/jobs", jobRoutes)
app.use("/api/v1/messages", messageRoutes)
app.use("/api/v1/milestones", milestoneRoutes)
app.use("/api/v1/praposals", praposalRoutes)
app.use("/api/v1/quizes", quizRoutes)
app.use("/api/v1/quizAttempts", quizAttemptRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/transactions", transactionRoutes)
app.use("/api/v1/wallets", walletRoutes)



server.listen(port, () => {
    connectDb();
    console.log(`Example app listening on port ${port}`)
})