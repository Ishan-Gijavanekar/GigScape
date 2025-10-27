import Transaction from "../models/transaction.js";
import Wallet from "../models/wallet.js";
import User from "../models/user.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_kEY);

const createStripePaymentIntent = async (req, res) => {
    try {
        const {amount, currency = "inr", wallet, reason = "Wallet Top up"} = req.body;

        if (!amount || !currency || !wallet) {
            return res.status(401).json({message: "All fields are required"});
        }

        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'client') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const walletData = await Wallet.findById(wallet);
        if (!walletData) {
            return res.status(401).json({message: "Wallet not found"});
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            metadata: {userId, wallet, reason}
        });

        const transaction = new Transaction({
            wallet: walletData._id,
            user: userId,
            amount,
            currency,
            type: "credit",
            reason,
            provider: "stripe",
            providerPaymentId: paymentIntent.id,
        });

        await transaction.save();

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret, 
            message: "Payment intent created successfully"
        });
    } catch (error) {
        console.log(`Error in createStripePaymentIntent controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const confirmStripePayment = async (req, res) => {
    try {
        const {paymentIntentId} = req.body;

        if (!paymentIntentId) {
            return res.status(401).json({message: "Payment intent id is required"});
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === "succeeded") {
            const transaction = await Transaction.findOneAndUpdate(
                {providerPaymentId: paymentIntentId},
                {status: "success"},
                {new: true}
            );


            if (!transaction) {
                return res.status(401).json({message: "Transaction not found"});
            }

            return res.status(200).json({transaction ,message: "Payment confirmed successfully"});
        } else {

            const transaction = await Transaction.findOneAndUpdate(
                {providerPaymentId: paymentIntentId},
                {status: "failed"},
                {new: true}
            );
            return res.status(401).json({
                message: "Payment failed",
                status: paymentIntent.status
            });
        }
    } catch (error) {
        console.log(`Error in confirmStripePayment controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const refundStripePayment = async (req, res) => {
    try {
        const {id} = req.params;
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(401).json({message: "Transaction not found"});
        }

        if (transaction.provider != "stripe") {
            return res.status(401).json({message: "Invalid transaction"});
        }

        const refund = await stripe.refunds.create({
            payment_intent: transaction.providerPaymentId,
        });
        
        transaction.status = "refunded";
        await transaction.save();

        return res.status(200).json({message: "Payment refunded successfully"});
    } catch (error) {
        conaole.log(`Error in refundStripePayment controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const createManualTransaction = async (req, res) => {
    try {
        const {wallet, amount, currency, type, reason, provider} = req.body;

        if (!wallet || !amount || !currency || !type || !reason || !provider) {
            return res.status(401).json({message: "All fields are required"});
        }

        const walletData = await Wallet.findById(wallet);
        if (!walletData) {
            return res.status(401).json({message: "Wallet not found"});
        }

        const user = await User.findById(req.user.userId);
        if (!user && user.role !== 'client') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const transaction = new Transaction({
            wallet: walletData._id,
            user: req.user.userId,
            amount,
            currency,
            type,
            reason,
            provider,
        });

        await transaction.save();

        return res.status(200).json({transaction, message: "Transaction created successfully"});
    } catch (error) {
        conaole.log(`Error in createManualTransaction controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getTransactionById = async (req, res) => {
    try{
        const id = req.params.id;
        const transaction = await Transaction.findById(id)
                            .populate("wallet")
                            .populate("user")
                            .populate("relatedContract")
                            .populate("relatedMileStone");

        if (!transaction) {
            return res.status(401).json({message: "Transaction not found"});
        }

        return res.status(200).json({transaction, message: "Transaction found successfully"}); 
    } catch (error) {
        console.log(`Error in getTransactionById controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getUserTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const transaction = await Transaction.find({user: userId})
            .sort({createdAt: -1})
            .populate("wallet")
            .populate("relatedContract")
            .populate("relatedMileStone");

        if (!transaction) {
            return res.status(401).json({message: "Transactions not found"});
        }

        return res.status(200).json({transaction, message: "Transactions fetched successfully"});
    } catch (error) {
        console.log(`Error in getUserTransactions controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAdminTransactionStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const stats = await Transaction.aggregate([
            {$group: {
                _id: "$status",
                totalAmount: {$sum: "$amount"},
                count: {$sum: 1}
            }}
        ])

        return res.status(200).json({stats, message: "Stats fetched successfully"});
    } catch (error) {
        conaole.log(`Error in getAdminTransactionStats controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const id = req.params.id;
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(401).json({message: "Transaction not found"});
        }

        transaction.status = status;
        await transaction.save();

        return res.status(200).json({message: "Transaction status updated successfully"});
    } catch (error) {
        console.log(`Error in updateTransactionStatus controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    createStripePaymentIntent,
    confirmStripePayment,
    refundStripePayment,
    createManualTransaction,
    getTransactionById,
    getUserTransactions,
    getAdminTransactionStats,
    updateTransactionStatus
}