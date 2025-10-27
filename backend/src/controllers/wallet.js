import Wallet from "../models/wallet.js";
import Transaction from "../models/transaction.js";

const createWallet = async (req, res) => {
    try {
        const userId = req.user.userId;

        const exsistingWallet = await Wallet.findOne({user: userId});
        if (exsistingWallet) {
            return res.status(401).json({message: "Wallet already exists"});
        }

        const wallet = new Wallet({user: userId});
        await wallet.save();

        return res.status(200).json({wallet, message: "Wallet created successfully"});
    } catch (error) {
        console.log(`Error in createWallet controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getWallet = async (req, res) => {
    try {
        const userId = req.user.userId;

        const wallet = await Wallet.findOne({user: userId}).populate("transactions");
        if (!wallet) {
            return res.status(401).json({message: "Wallet not found"});
        }

        return res.status(200).json({wallet, message: "Wallet fetched successfully"});
    } catch (error) {
        console.log(`Error in getWallet controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getWalletBalance = async (req, res) => {
    try {
        const userId = req.user.userId;

        const wallet = await Wallet.findOne({user: userId}).populate("transactions");

        if (!wallet) {
            return res.status(401).json({message: "Wallet not found"});
        }

        const balance = wallet.balance;
        return res.status(200).json({balance, message: "Wallet balance fetched successfully"});
    } catch (error) {
        console.log(`Error in getWalletBalance controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const depositFunds = async (req, res) => {
    try {
        const {amount} = req.body;
        const userId = req.user.userId;

        const wallet = await Wallet.findOne({user: userId});
        if (!wallet) {
            return res.status(401).json({message: "Wallet not found"});
        }

        wallet.balance += amount;
        wallet.updatedAt = Date.now();
        await wallet.save();

        const transaction = new Transaction({
            wallet: wallet._id,
            user: userId,
            amount,
            currency: "inr",
            type: "credit",
            reason: "Wallet Top up",
            provider: "wallet",
            status: "succeeded",
        });

        await transaction.save();

        return res.status(200).json({message: "Funds deposited successfully"});
    } catch (error) {
        console.log(`Error in depositFunds controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const withdrawFunds = async (req, res) => {
    try {
        const {amount, reason} = req.body;
        const userId = req.user.userId;

        const wallet = await Wallet.findOne({user: userId});
        if (!wallet) {
            return res.status(401).json({message: "Wallet not found"});
        }

        if (wallet.balance < amount) {
            return res.status(401).json({message: "Insufficient funds"});
        }

        wallet.balance -= amount;
        wallet.updatedAt = Date.now();
        await wallet.save();

        const transaction = new Transaction({
            wallet: wallet._id,
            user: userId,
            amount,
            currency: "inr",
            type: "debit",
            reason,
            provider: "wallet",
            status: "succeeded",
        });

        await transaction.save();

        return res.status(200).json({message: "Funds withdrawn successfully"});
    } catch (error) {
        console.log(`Error in withdrawFunds controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const holdFunds = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {amount, reason, relatedTo} = req.body;

        const wallet = await Wallet.findOne({user: userId});
        if (!wallet) {
            return res.status(401).json({message: "Wallet not found"});
        }

        if (wallet.balance < amount) {
            return res.status(401).json({message: "Insufficient funds"});
        }

        wallet.balance -= amount;
        wallet.updatedAt = Date.now();
        wallet.holds.push({amount, reason, relatedId: relatedTo});
        await wallet.save();

        return res.status(200).json({
            message: "Funds held successfully",
            holds: wallet.holds
        });
    } catch (error) {
        console.log(`Error in holdFunds controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const releseHolds = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {relatedTo} = req.params;

        const wallet = await Wallet.findOne({user: userId});
        if (!wallet) {
            return res.status(401).json({message: "Wallet not found"});
        }

        const hold = wallet.holds.find(hold => hold.relatedId.toString === relatedTo);
        if (!hold) {
            return res.status(401).json({message: "Hold not found"});
        }

        wallet.balance += hold.amount;
        wallet.updatedAt = Date.now();
        wallet.holds = wallet.holds.filter(hold => hold.relatedId.toString() !== relatedTo);
        await wallet.save();

        return res.status(200).json({
            message: "Funds released successfully",
            holds: wallet.holds
        });
    } catch (error) {
        console.log(`Error in releseHolds controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getWalletTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const wallet = await Wallet.findOne({user: userId});
        if (!wallet) {
            return res.status(401).json({message: "Wallet not found"});
        }

        const transaction = await Transaction.find({wallet: wallet._id})
            .sort({createdAt: -1})
            .populate("wallet")
            .populate("relatedContract")
            .populate("relatedMileStone");

        if (!transaction) {
            return res.status(401).json({message: "Transactions not found"});
        }

        return res.status(200).json({transaction, message: "Transactions fetched successfully"});
    } catch (error) {
        console.log(`Error in getWalletTransactions controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    createWallet,
    getWallet,
    getWalletBalance,
    depositFunds,
    withdrawFunds,
    holdFunds,
    releseHolds,
    getWalletTransactions
}