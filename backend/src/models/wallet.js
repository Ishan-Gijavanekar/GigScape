import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {type: String, default: "inr"},
    holds:  [{
        amount: Number,
        reason: String,
        relatedId: mongoose.Schema.Types.ObjectId,
    }],
    updatedAt: {type: Date, default: Date.now},
}, {
    timestamps: true,
});

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;