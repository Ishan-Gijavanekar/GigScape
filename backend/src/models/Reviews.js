import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    title: String,
    comment: String
}, {
    timestamps: true,
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;