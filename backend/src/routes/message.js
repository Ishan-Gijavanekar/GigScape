import express from 'express';
import { sendMessage, getMessages, markMessageAsRead, deleteMessage } from "../controllers/message.js";
import { secure } from '../middlewares/auth.js';


const router = express.Router();

router.post("/sendMessage", secure, sendMessage);
router.get("/getMessages", secure, getMessages);
router.put("/markMessageAsRead/:id", secure, markMessageAsRead);
router.delete("/deleteMessage/:id", secure, deleteMessage);


export default router;