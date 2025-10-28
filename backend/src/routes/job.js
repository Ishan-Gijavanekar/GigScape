import express from 'express';
import { createJob, uploadAttachments, updateJob, deleteJob, updateJobStatus, getAllMyJobs, getJobById, getJobs, getJobByIdFreelancer, getAllJobs, featuredaJob, adminDeleteJob } from "../controllers/jobs.js";
import { secure } from '../middlewares/auth.js';


const router = express.Router();

router.post("/createJob", secure, createJob);
router.post("/uploadAttachments", secure, uploadAttachments);
router.put("/updateJob/:id", secure, updateJob);
router.delete("/deleteJob/:id", secure, deleteJob);
router.put("/updateJobStatus/:id", secure, updateJobStatus);
router.get("/getAllMyJobs", secure, getAllMyJobs);
router.get("/getJobById/:id", secure, getJobById);
router.get("/getJobs", secure, getJobs);
router.get("/getJobByIdFreelancer/:id", secure, getJobByIdFreelancer);
router.get("/getAllJobs", secure, getAllJobs);
router.put("/featuredaJob/:id", secure, featuredaJob);
router.delete("/adminDeleteJob/:id", secure, adminDeleteJob);


export default router;