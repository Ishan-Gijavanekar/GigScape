import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chatroom",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {type: String},
    attachments: [{
        url: String,
        public_id: String,
        mimeType: String,
    }],
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
} ,{ 
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);
export default Message;