import Praposal from "../models/praposal.js";
import User from "../models/user.js";
import Chatroom from "../models/chatRoom.js";

const createRoom = async (req, res) => {
    try {
        const id = req.user.userId;
        const praposal = await Praposal.find({freelancer: id})
        .populate("job", "title, client")
        .sort({createdAt: -1})
        .limit(1);

        if (!praposal) {
            return res.status(401).json({message: "No praposal found"});
        }

        const participants = [id, praposal.job.client];
        const name = await praposal.job.title;
        const isGroup = false;

        const chatroom = new Chatroom({
            participants,
            isGroup,
            name,
        });

        await chatroom.save()

        return res.status(200).json({
            chatroom,
            message: "Chat room created"
        });
    } catch (error) {
        console.log(`Error in createRoom controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getUserChatRooms = async (req, res) => {
    try {
        const id = req.user.userId;
        const chatRooms = await Chatroom.find({participants: id})
        .populate("lastMessage")
        .populate("participants", "name, email")

        if (!chatRooms) {
            return res.status(401).json({message: "Chat rooms not available"});
        }

        return res.status(200).json({
            chatRooms,
            message: "chat rooms fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getUserChatRooms controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getChatRoomById = async (req, res) => {
    try {
        const id = req.params.id;
        const chatRoom = await Chatroom.findById(id)
        .populate("participants", "name, email")
        .populate({
            path: "lastMessage",
            populate: {path: "sender", select: "name"}
        });

        if (!chatRoom) {
            return res.status(401).json({message: "Chat room with this is not available"});
        }

        return res.status(200).json({
            chatRoom,
            message: "Chat room fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getChatRoomById controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateChatRoom = async (req, res) => {
    try {
        const {user, name, isGroup} = req.body;
        const id = req.params.id;

        const chatRoom = await Chatroom.findById(id);
        if (!chatRoom) {
            return res.status(401).json({message: "Chat room not found"});
        }

        chatRoom.participants = [...chatRoom.participants, user];
        chatRoom.name = name;
        chatRoom.isGroup = isGroup;

        await chatRoom.save();
        return res.status(200).json({
            chatRoom,
            message: "Chat room updated successfully"
        });
    } catch (error) {
        console.log(`Error in updateChatRoom controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteChatRoom = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user && user.role !== 'admin') {
            return res.status(403).json({messsage: "Unauthorized"});
        }
        const chatRoom = await Chatroom.findById(req.params.id);
        if (!chatRoom) {
            return res.status(401).json({message: "Chat room not found"});
        }
        await Chatroom.findByIdAndDelete(req.params.id);

        return res.status(200).json({message: "ChatRoom deleted suxxessfully"});
    } catch (error) {
        console.log(`Error in deleteChatRoom controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    createRoom,
    getUserChatRooms,
    getChatRoomById,
    updateChatRoom,
    deleteChatRoom,
}