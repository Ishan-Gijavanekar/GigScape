import express from 'express';
import { createReview, getJobReviews, getReviewById, getReviewOfFreelancer, updateReviews, deleteReview, getAllReviews } from "../controllers/revirew.js"
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.post("/createReview", secure, createReview);
router.get("/getJobReviews/:id", secure, getJobReviews);
router.get("/getReviewById/:id", secure, getReviewById);
router.get("/getReviewOfFreelancer/:id", secure, getReviewOfFreelancer);
router.put("/updateReviews/:id", secure, updateReviews);
router.delete("/deleteReview/:id", secure, deleteReview);
router.get("/getAllReviews", secure, getAllReviews);


export default router