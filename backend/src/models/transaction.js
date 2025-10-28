import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {type: Number, default: 0},
    currency: {type: String, default: "inr"},
    type: {
        type: String,
        enum: ['credit','debit','payout','fee','refund'],
        required: true,
    },
    reason: String,
    provider: {
        type: String,
        enum: ['stripe', 'wallet', 'bank'],
        default: 'wallet',
    },
    providerPaymentId: String,
    relatedContract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
    },
    relatedMilestone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
    },
    status: {
        type: String,
        enum: ['initiated','succeeded','failed','refunded'],
        default: 'initiated',
    },
}, {
    timestamps: true,
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;