import Praposal from "../models/praposal.js";
import User from "../models/user.js";

const subMitPraposal = async (req, res) => {
    try {
        const {job, coverLetter, bidAmount, currency, estimatedHours} = req.body;
        if (!job || !coverLetter || !bidAmount || !currency || !estimatedHours) {
            return res.status(401).json({message: "All fields are required"});
        }

        const userId = req.user.userId;
        const freelancer = await User.findById(userId);
        if (!freelancer && freelancer.role !== 'freelancer') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const praposal = new Praposal({
            job,
            freelancer: freelancer._id,
            coverLetter,
            bidAmount,
            currency,
            estimatedHours,
        });

        await praposal.save();

        return res.status(200).json({
            praposal,
            message: "Praposal saved successfully"
        });
    } catch (error) {
        console.log(`Error in submitPraposal Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

const withdrawPraposal = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const praposal = await Praposal.findOne({_id: id, freelancer: userId});
        if (!praposal) {
            return res.status(401).json({message: "Unauthorized or wronge praposal"});
        }

        praposal.status = "withdraw";
        await praposal.save();

        return res.status(200).json({message: "Praposal withdrawn successfully"});
    } catch (error) {
        console.log(`Error in withdrawPraposal Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

const getMyPraposal = async (req, res) => {
    try {
        const userId = req.user.userId;
        const praposals = await Praposal.find({freelancer: userId}).populate("job", "title, status");

        if (!praposals) {
            return res.status(401).json({message: "No praposals"});
        }

        return res.status(200).json({
            praposals,
            message: "Praposals fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getMyPraposal Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

// Client

const getJobPraposals = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userid = req.user.userId;
        const job = await Job.findOne({_id: jobId, client: userid});
        if (!job) {
            return res.status(401).json({message: "Unauthorized or job not found"});
        }

        const praposals = await Praposal.find({job: jobId}).populate("freelancer", "name, email");

        if (!praposals) {
            return res.status(401).json({message: "No praposals"});
        }

        return res.status(200).json({
            praposals,
            message: "Praposals fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getJobPraposals Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

const getPraposalById = async (req, res) => {
    try {
        const id = req.params.id;
        const praposals = await Praposal.findOne({_id: id})
        .populate("freelancer", "name, email")
        .populate("job", "title, status");

        if (!praposals) {
            return res.status(401).json({message: "Unauthorized or praposal not found"});
        }

        return res.status(200).json({
            praposals,
            message: "Praposal fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getPraposalById Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

const updatePraposalStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const praposal = await Praposal.findById(id).populate("job");
        if (!praposal) {
            return res.status(401).json({message: "Unauthorized or praposal not found"});
        }

        if (praposal.job.client.toString() !== userId.toString()) {
            return res.status(401).json({message: "Unauthorized"});
        }

        praposal.status = req.body.status;
        await praposal.save();

        return res.status(200).json({message: "Praposal status updated successfully"});
    } catch (error) {
        console.log(`Error in updatePraposalStatus Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

// Admin
const adminGetAllPraposals = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const praposals = await Praposal.find()
        .populate("freelancer", "name, email")
        .populate("job", "title, status");

        if (!praposals) {
            return res.status(401).json({message: "No praposals"});
        }

        return res.status(200).json({
            praposals,
            message: "Praposals fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getAllPraposals Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

const deletePraposal = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = req.params.id;
        const praposal = await Praposal.findById(id);
        if (!praposal) {
            return res.status(401).json({message: "Unauthorized or praposal not found"});
        }

        await Praposal.findByIdAndDelete(id);

        return res.status(200).json({message: "Praposal deleted successfully"});
    } catch (error) {
        console.log(`Error in deletePraposal Controller: ${error}`);
        return res.status(500).json({message: "Internal Server error"});
    }
}

export {
    subMitPraposal,
    getMyPraposal,
    withdrawPraposal,
    getJobPraposals,
    getPraposalById,
    updatePraposalStatus,
    adminGetAllPraposals,
    deletePraposal
}