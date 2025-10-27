import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: String,
    title: String,
    body: String,
    link: String,
    isRead: String,
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;