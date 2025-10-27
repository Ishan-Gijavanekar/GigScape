import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    isGroup: {type: Boolean, default: false},
    name: String,
    meta: mongoose.Schema.Types.Mixed,
}, {
    timestamps: true
});

const Chatroom = mongoose.model("Chatroom", chatRoomSchema);
export default Chatroom;