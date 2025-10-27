import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ["emailVerification", 'resetPassword'],
        default: "emailVerification"
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    used: {type: Boolean, default: false},
}, {
    timestamps: true,
});

verificationSchema.index({expiresAt: 1});

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;