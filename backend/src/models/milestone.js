import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
        required: true,
        index: true,
    },
    title: String,
    description: String,
    dueDate: Date,
    amount: {type: Number, required: true},
    currency: {type: String, default: 'inr'},
    status: {
        type: String,
        enum: ['pending','submitted','approved','released','disputed'], 
        default: 'pending' 
    },
    dilevarables: [{
        url: String,
        public_Id: String,
        mimeType: String
    }]
}, {
    timestamps: true,
});

const Milestone = mongoose.model("Milestone", MilestoneSchema);
export default Milestone;