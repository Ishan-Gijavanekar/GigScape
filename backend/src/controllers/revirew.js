import Job from '../models/job.js';
import User from '../models/user.js';
import Review from '../models/Reviews.js';

const createReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role === 'freelancer') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({message: "Job not found"});
        }

        const { rating, comment, title } = req.body;
        const review = await Review.create({
            reviewer: userId,
            reviewee: job.freelancer,
            job: jobId,
            contract: job.contract,
            rating,
            comment,
            title,
        });

        if (!review) {
            return res.status(500).json({message: "Internal server error"});
        }

        return res.status(201).json({message: "Review created successfully", review});
    } catch (error) {
        console.log(`Error in createReview controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getJobReviews = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({message: "Job not found"});
        }

        const reviews = await Review.find({job: id}).populate("reviewer", "name email").populate("reviewee", "name email");

        if (!reviews) {
            return res.status(401).json({message: "Reviews not available"});
        }

        return res.status(200).json({reviews, message: "Reviews fetched successfully"});
    } catch (error) {
        console.log(`Error in getReviews controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getReviewById = async (req, res) => {
    try {
        const id = req.params.id;

        const review = await Review.findById(id).populate("reviewer", "name email").populate("reviewee", "name email");

        if (!review) {
            return res.status(401).json({message: "Review not available"});
        }

        return res.status(200).json({review, message: "Review fetched successfully"});
    } catch (error) {
        console.log(`Error in getReviewById controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getReviewOfFreelancer = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        if (user.role !== "freelancer") {
            return res.status(401).json({message: "Unauthorized"});
        }

        const reviews = await Review.find({reviewee: id}).populate("reviewer", "name email").populate("reviewee", "name email");

        if (!reviews) {
            return res.status(401).json({message: "Reviews not available"});
        }

        return res.status(200).json({reviews, message: "Reviews fetched successfully"});
    } catch (error) {
        console.log(`Error in getReviewOfFreelancer controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateReviews = async (req, res) => {
    try {
        const id = req.params.id;
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        const { rating, comment, title } = req.body;
        review.rating = rating;
        review.comment = comment;
        review.title = title;

        await review.save();

        return res.status(200).json({message: "Review updated successfully"});
    } catch (error) {
        console.log(`Error in updateReviews controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        await review.remove();

        return res.status(200).json({message: "Review deleted successfully"});
    } catch (error) {
        console.log(`Error in deleteReview controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAllReviews = async(req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }
        const reviews = await Review.find().populate("reviewer", "name email").populate("reviewee", "name email");
        
        if (!reviews) {
            return res.status(401).json({message: "Reviews not available"});
        }
        
        return res.status(200).json({reviews, message: "Reviews fetched successfully"});
    } catch (error) {
        console.log(`Error in getAllReviews controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    createReview,
    getJobReviews,
    getReviewById,
    getReviewOfFreelancer,
    updateReviews,
    deleteReview,
    getAllReviews
}