import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true,
    },
    parposal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Praposal",
        required: true,
        index: true,
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    totalAmount: {type: Number, required: true},
    currency: {type: String, default: 'inr'},
    startDate: Date,
    endDate: Date,
    status: {
        type: String,
        enum: ['pending','active','paused','completed','terminated','disputed'],
        default: 'pending',
    },
    escrowStatus: {
        type: String,
        enum: ['not_required','funds_held','released','refunded'],
        default: 'not_required',
    },
    mileStones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
    }]
}, {
    timestamps: true,
});

const Contract = mongoose.model("Contract", ContractSchema);
export default Contract;