import express from 'express';
import { createRoom, getChatRoomById, getUserChatRooms, updateChatRoom, deleteChatRoom } from "../controllers/chatRoom.js";
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.post("/createRoom", secure, createRoom);
router.get("/getUserChatRooms", secure, getUserChatRooms);
router.get("/getChatRoomById/:id", secure, getChatRoomById);
router.put("/updateChatRoom/:id", secure, updateChatRoom);
router.delete("/deleteChatRoom/:id", secure, deleteChatRoom);


export default router