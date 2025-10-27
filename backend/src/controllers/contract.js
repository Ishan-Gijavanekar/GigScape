import Contract from "../models/contract.js";
import Milestone from "../models/milestone.js";
import User from "../models/user.js";
import Praposal from "../models/praposal.js";

const createContract = async (req, res) => {
    try {
        const {praposal, startDate, endDate} = req.body;

        const praposalDetails = await Praposal.findById(praposal)
            .populate("job")
            .populate("freelancer");

        if (!praposalDetails) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (praposalDetails.status !== "accepted") {
            return res.status(401).json({message: "The praposal is not accepted"});
        }

        const contract = new Contract({
            job: praposalDetails.job._id,
            parposal: praposal,
            freelancer: praposalDetails.freelancer._id,
            client: praposalDetails.job.client,
            totalAmount: praposalDetails.bidAmount,
            currency: praposalDetails.currency,
            startDate,
            endDate
        });
        
        await contract.save();

        return res.status(200).json({
            contract,
            message: "Contract created successfully"
        });
    } catch (error) {
        console.log(`Error in createContract controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getContracts = async (req, res) => {
    try {
        const {client, freelancer, status} = req.query;
        let filters = {};

        if (client) filters.client = client;
        if (freelancer) filters.freelancer = freelancer;
        if (status) filters.status = status;

        const contracts = await Contract.find(filters)
            .populate("job")
            .populate("freelancer", "name, email")
            .populate("client", "name, email")
            .populate("mulestone");
    } catch (error) {
        console.log(`Error in getContracts controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getContractById = async (req, res) => {
    try {
        const id = req.params.id;

        const contract = await Contract.findById(id)
            .populate("job")
            .populate("freelancer", "name, email")
            .populate("client", "name, email")
            .populate("mulestone")
            .populate("praposal");

        if (!contract) {
            return res.status(401).json({message: "Unauthorized"});
        }

        return res.status(200).json({
            contract,
            message: "Contract fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getContractById controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateContract = async (req, res) => {
    try {
        const {totalAmount, currency, startDate, endDate} = req.body;
        const id = req.params.id;

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(401).json({message: "Unauthorized"});
        }

        contract.totalAmount = totalAmount;
        contract.currency = currency;
        contract.startDate = startDate;
        contract.endDate = endDate;
        await contract.save();

        return res.status(200).json({
            contract,
            message: "Contract updated successfully"
        });
    } catch (error) {
        console.log(`Error in updateContract controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteContract = async (req, res) => {
    try {
        const id = req.params.id;
        const userid = req.user.userId;
        const user = await User.findById(userid);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(401).json({message: "Unauthorized"});
        }

        await Contract.findByIdAndDelete(id);

        return res.status(200).json({message: "Contract deleted successfully"});
    } catch (error) {
        console.log(`Error in deleteContract controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateContractStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const id = req.params.id;
        const userId = req.user.userId;
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (contract.freelancer.toString() !== userId && contract.client.toString() !== userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        contract.status = status;
        await contract.save();

        return res.status(200).json({message: "Contract status updated successfully"});
    } catch (error) {
        console.log(`Error in updateContractStatus controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateEscrowStatus = async (req, res) => {
    try {
        const { escrowStatus } = req.body;
        const id = req.params.id;
        const userId = req.user.userId;
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (contract.freelancer.toString() !== userId && contract.client.toString() !== userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        contract.escrowStatus = escrowStatus;
        await contract.save();

        return res.status(200).json({message: "Escrow status updated successfully"});
    } catch (error) {
        console.log(`Error in updateEscrowStatus controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getMyContracts = async (req, res) => {
    try {
        const userId = req.user.userId;

        const contracts = await Contract.find({$or: [{freelancer: userId}, {client: userId}]})
            .populate("job")
            .populate("praposal")
            .populate("milestone")

        if (!contracts) {
            return res.status(401).json({message: "No contracts available"});
        }

        return res.status(200).json({
            contracts,
            message: "Contracts fetched successfully"
        })
    } catch (error) {
        console.log(`Error in getClientContracts controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAdminStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const stats = await Contract.aggregate([
            {$group: {
                _id: "$status",
                count: {$sum: 1},
                totalAmount: {$sum: "$totalAmount"}
            }}
        ]);

        return res.status(200).json({
            stats,
            message: "Stats fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getAdminStats controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export {
    createContract,
    getContracts,
    getContractById,
    updateContract,
    deleteContract,
    updateContractStatus,
    updateEscrowStatus,
    getMyContracts,
    getAdminStats
}