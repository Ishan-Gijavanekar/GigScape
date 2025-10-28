import express from 'express';
import { createMilestone, updateMileStoneStatus, attachFile, getMileStoneById, getMileStones, updateMileStone, deleteMilestone, getAdminMilestones } from '../controllers/milestone.js';
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.post("/createMilestone", secure, createMilestone);
router.put("/updateMileStoneStatus/:id", secure, updateMileStoneStatus);
router.post("/attachFile/:id", secure, attachFile);
router.get("/getMileStones", secure, getMileStones);
router.get("/getMileStoneById/:id", secure, getMileStoneById);
router.put("/updateMileStone/:id", secure, updateMileStone);
router.delete("/deleteMilestone/:id", secure, deleteMilestone);
router.get("/getAdminMilestones", secure, getAdminMilestones);



export default router;