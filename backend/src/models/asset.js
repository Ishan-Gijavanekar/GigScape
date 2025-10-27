import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: String,
    provider: {
        type: String,
        enum: ["cloudinary", 's3', 'local'],
        default: 'cloudinary'
    },
    mimeType: String,
    size: Number,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tags: [String],
}, {
    timestamps: true,
});

const Asset = mongoose.model("Asset", assetSchema);
export default Asset;