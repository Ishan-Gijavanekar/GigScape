import mongoose from 'mongoose';

const praposalSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true,
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    coverLetter: String,
    bidAmount: {
        type: Number,
        required: true,
    },
    currency: {type: String, default: "inr"},
    estimatedHours: Number,
    attachments: [{
        url: String,
        public_id: String,
        mimeType: String
    }],
    status: {
        type: String,
        enum: ['pending','accepted','rejected','withdrawn'],
        default: 'pending',
    },  
}, {
    timestamps: true,
});

const Praposal = mongoose.model("Praposal", praposalSchema);
export default Praposal;