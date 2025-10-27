import Milestone from "../models/milestone.js";
import Contract from "../models/contract.js";
import User from "../models/user.js";
import {cloudinary} from "../utils/cloudinary.js";

const createMilestone = async (req, res) => {
    try {
        const {contract, title, description, dueDate, amount, currency} = req.body;

        if (!contract || !title || !description || !dueDate || !amount || !currency) {
            return res.status(401).json({message: "These fields are required"});
        }
        const contractExsists = await Contract.findById(contract);
        if (!contractExsists) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const userId = req.user.userId;
        if (contract.client.toString() !== userId || contract.freelancer.toString() !== userId) {
            return res.status(401).json({message: "Unauthorized"});
        }
        
        const milestone = new Milestone({
            contract,
            title,
            description,
            dueDate,
            amount,
            currency
        });

        await milestone.save();

        contract.milestones.push(milestone._id);
        await contract.save();

        return res.status(200).json({
            milestone,
            message: "Milestone created successfully"
        });
    } catch (error) {
        console.log(`Error in createMilestone controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateMileStoneStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const {status} = req.body;
        const milestone = await Milestone.findById(id)
            .populate("contract", "client freelancer");
        if (!milestone) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const userId = req.user.userId;
        if (milestone.contract.client.toString() !== userId || milestone.contract.freelancer.toString() !== userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        milestone.status = status;
        await milestone.save();

        return res.status(200).json({message: "Milestone status updated successfully"});
    } catch (error) {
        console.log(`Error in updateMileStoneStatus controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const attachFile = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const milestone = await Milestone.findById(id)
            .populate("contract", "client freelancer");
        if (!milestone) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (milestone.contract.client.toString() !== userId || milestone.contract.freelancer.toString() !== userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        let url = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            url = result.secure_url;
        }

        milestone.attachments.push({url, public_id: url, mimeType: "pdf"});
        await milestone.save();

        return res.status(200).json({message: "File attached successfully"});
    } catch (error) {
        console.log(`Error in attachFile controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getMileStones = async (req, res) => {
    try {
        const contractId = req.params.id;
        const contract = await Contract.findById(contractId);

        if (!contract) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const userId = req.user.userId;
        if (contract.client.toString() !== userId || contract.freelancer.toString() !== userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const milestones = await Milestone.find({contract: contractId});

        if (!milestones) {
            return res.status(401).json({message: "Unauthorized"});
        }

        return res.status(200).json({milestones, message: "Milestones fetched successfully"});
        
    } catch (error) {
        console.log(`Error in getContracts controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getMileStoneById = async (req, res) => {
    try {
        const id = req.params.id;

        const milestone = await Milestone.findById(id)
            .populate("contract");

        if (!milestone) {
            return res.status(401).json({message: "Unauthorized"});
        }

        return res.status(200).json({milestone, message: "Milestone fetched successfully"});
    } catch (error) {
        console.log(`Error in getMileStoneById controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateMileStone = async (req, res) => {
    try {
        const {title, description, dueDate, amount, currency} = req.body;
        const id = req.params.id;

        const milestone = await Milestone.findById(id);
        if (!milestone) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const updatedMileStone = await Milestone.findByIdAndUpdate(id, {
            title,
            description,
            dueDate,
            amount,
            currency
        }, {new: true});

        return res.status(200).json({milestone: updatedMileStone, message: "Milestone updated successfully"});
    } catch (error) {
        console.log(`Error in updateMileStone controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteMilestone = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const milestone = await Milestone.findById(id)
            .populate("contract", "client freelancer");

        if (!milestone) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (milestone.contract.client.toString() !== userId || milestone.contract.freelancer.toString() !== userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        await Milestone.findByIdAndDelete(id);

        return res.status(200).json({message: "Milestone deleted successfully"});
    } catch (error) {
        console.log(`Error in deleteMilestone controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAdminMilestones = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(401).json({message: "Unauthorized"});
        }

        const milestones = await Milestone.find().populate("contract").sort({createdAt: -1});

        if (!milestones) {
            return res.status(401).json({message: "Unauthorized"});
        }

        return res.status(200).json({milestones, message: "Milestones fetched successfully"});
    } catch (error) {
        console.log(`Error in getAdminMilestones controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export {
    createMilestone,
    updateMileStoneStatus,
    attachFile,
    getMileStones,
    getMileStoneById,
    updateMileStone,
    deleteMilestone,
    getAdminMilestones
}