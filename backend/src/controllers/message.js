import Message from '../models/message.js';
import Chatroom from '../models/chatRoom.js';
import {cloudinary} from '../utils/cloudinary.js';

const sendMessage = async (req, res) => {
    try {
        const {room, content} = req.body;
        let url = "";
        let size = 0;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            url = result.secure_url;
            size = result.bytes;
        }

        const chatRoom = await Chatroom.findById(room);
        if (!chatRoom) {
            return res.status(401).json({message: "Chat room not found"});
        }

        const chatMessage = new Message({
            room,
            sender: req.user.userId,
            content,
            attachments: [{url, public_id: url, mimeType: "pdf", size}]
        });

        await Chatroom.findByIdAndUpdate(room, {lastMessage: chatMessage._id});

        req.io.to(room.toString()).emit("message", chatMessage);

        await chatMessage.save();
        res.status(200).json({chatMessage,message: "Message sent successfully"});
    } catch (error) {
        console.log(`Error in sendMessage controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getMessages = async (req, res) => {
    try {
        const {roomId} = req.params;
        const messages = await Message.find({room: roomId})
        .populate("sender", "name, email")
        .sort({createdAt: -1});

        if (!messages) {
            return res.status(401).json({message: "No messages found"});
        }

        return res.status(200).json({
            messages, 
            message: "Messages fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getMessages controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const markMessageAsRead = async (req, res) => {
    try {
        const id = req.params.id;

        const message = await Message.findByIdAndUpdate(
            id,
            {$addToSet: {readBy: req.user.userId}},
            {new: true}
        );

        req.io.to(message.room.toString()).emit("read", {
            messageId: message._id,
            userId: message.readBy
        });

        return res.status(200).json({
            message, 
            message: "Message marked as read successfully"}
        )
    } catch (error) {
        console.log(`Error in markMessageAsRead controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;

        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(401).json({message: "Message not found"});
        }

        if (message.sender.toString() !== req.user.userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        await message.deleteOne();
        req.io.to(message.room.toString()).emit("delete", {
            messageId: message._id
        });

        res.status(200).json({message: "Message deleted successfully"});
    } catch (error) {
        console.log(`Error in deleteMessage controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    sendMessage,
    getMessages,
    markMessageAsRead,
    deleteMessage
}