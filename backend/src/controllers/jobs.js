import Job from '../models/job.js';
import User from '../models/user.js';
import { cloudinary } from "../utils/cloudinary.js";

const createJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { 
            title,
            description,
            category,
            skills,
            budgetType,
            budgetMin,
            fixedBudget,
            currency,
            durationWeeks,
            remote,
            location,
            status,
        } = req.body;

        if (!title || !description || !category || !skills) {
            return res.status(401).json({message: "These fields are required"});
        }

        const user = await User.findById(userId);
        if (!user && user.role !== 'client') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const job = new Job({
            title,
            description,
            client: userId,
            category,
            skills,
            budgetType,
            budgetMin,
            currency,
            remote,
            location,
            status,
            fixedBudget,
            durationWeeks,
        })

        await job.save();

        res.status(200).json({
            job,
            message: "Job added successfully"
        });
    } catch (error) {
        console.log(`Error in create job controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const uploadAttachments = async(req, res) => {
    try {
        let url = '';
        let size = 0;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            url = result.secure_url;
            size = result.bytes;
        }
        const {id} = req.params;
        const job = await Job.findById(id);
        if (!job) {
            return res.status(401).json({message: 'Not a valid job'});
        }
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== client && user._id !== job.client) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const obj = {
            url: url,
            public_id: url,
            mimeType: "pdf",
            size: size,
        };
        job.attachment = [...job.attachment, obj];

        res.status(200).json({mesasge: "File uploaded successfully"});
    } catch (error) {
        console.log(`Error in uploadAttachments controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateJob = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;

        const job = await Job.findById(id);
        if (!job) {
            return res.status(401).json({message: 'Not a valid job'});
        }

        const user = await User.findById(userId);
        if (!user && user.role !== client && user._id !== job.client) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const { 
            title,
            description,
            category,
            skills,
            budgetType,
            budgetMin,
            fixedBudget,
            currency,
            durationWeeks,
            remote,
            location,
            status,
        } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    description,
                    client: userId,
                    category,
                    skills,
                    budgetType,
                    budgetMin,
                    currency,
                    remote,
                    location,
                    fixedBudget,
                    durationWeeks,
                }
            },
            {
                new: true,
            }
        ).select("-_id, -client");

        res.status(200).json({
            updatedJob,
            message: "Job updtaed successfully"
        });

    } catch (error) {
        console.log(`Error in updateJob controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteJob = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;
        const job = await Job.findOne({_id: id, client: userId});
        if (!job) {
            return res.status(404).json({message: "No job found"});
        }

        await Job.findByIdAndDelete(id);

        res.status(200).json({message: "Job deleted successfully"});
    } catch (error) {
        console.log(`Error in deleteJob controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateJobStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const jobId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(401).json({message: "Ststus is required"});
        }

        const user = await User.findById(userId);
        if (!user && user.role !== 'freelancer') {
            return res.status(401).json({message: "Unauthorized"});
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({message: "Job not found"});
        }

        job.status = status;
        await job.save();

        res.status(200).json({message: "Ststus updated successfully"});
    } catch (error) {
        console.log(`Error in updateStstus controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAllMyJobs = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'client') {
            return res.status(401).json({message: "Unathorized"});
        } 
        const jobs = await Job.find({client: userId})
        .populate("client name");
        if (!jobs) {
            return res.status(404).json({message: "Jobs not found"});
        }

        res.status(200).json({
            jobs,
            message: "Jobs fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getAllMyJobs controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getJobById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'client') {
            return res.status(401).json({message: "Unathorized"});
        } 
        const job = await Job.findOne({_id: req.params.id ,client: userId})
        .populate("client name");
        if (!job) {
            return res.status(404).json({message: "Jobs not found"});
        }

        res.status(200).json({
            job,
            message: "Job fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getJobById controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

// For freelancers

const getJobs = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.skills) filters.skills = {$in: req.query.skills.split(",")};
        if (req.query.remote) filters.remote = req.query.remote === 'remote';
        if (req.query.featured) filters.featured = true;
        if (req.query.budgetMin || req.query.budgetMax) {
            filters.budgetMin = {$gt: req.query.budgetMin};
            if (req.query.budgetMax) {
                filters.budgetMax = {$lte: req.query.budgetMax}
            }
        }

        const jobs = await Job.find(filters).populate("client", "name").sort({createdAt: -1});

        if (!jobs) {
            return res.status(401).json({message: "No Jobs found"});
        }

        res.status(200).json({
            jobs,
            message: "Jobs fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getJobs controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getJobByIdFreelancer = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        .populate("client", "name email")
        .populate("category", "name")
        .populate("skills", "name");

        if (!job) {
            return res.status(401).json({message: "No Job found"});
        }

        job.views += 1;
        await job.save();

        res.status(200).json({
            job,
            message: 'Job fetched successfully'
        });
    } catch (error) {
        console.log(`Error in getJobByIdFreelancer controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Admin Specific Routes

const getAllJobs = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const jobs = await Job.find();
        if (!jobs) {
            return res.status(401).json({message: "Jobs Not found"});
        }

        res.status(200).json({
            jobs,
            message: "All jobs fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getAllJobs controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const featuredaJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = req.params.id;
        const job = await Job.findById(id);
        if (!job) {
            return res.status(401).json({message: "Job Not found"});
        }

        job.featured = req.body.featured ? true : false;
        await job.save();

        res.status(200).json({
            message: "Job featured successfully"
        });
    } catch (error) {
        console.log(`Error in featured job controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const adminDeleteJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = req.params.id;
        const job = await Job.findById(id);
        if (!job) {
            return res.status(401).json({message: "Job Not found"});
        }

        await Job.findByIdAndDelete(id);

        res.status(200).json({message: "Job deleted successfully"});
    } catch (error) {
        console.log(`Error in featured job controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    createJob,
    uploadAttachments,
    updateJob,
    deleteJob,
    updateJobStatus,
    getAllMyJobs,
    getJobById,
    getJobs,
    getJobByIdFreelancer,
    getAllJobs,
    featuredaJob,
    adminDeleteJob
}