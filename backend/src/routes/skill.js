import express from 'express';
import { addSkill, getSkills, getSkillById, updateSkill, deleteSkill } from "../controllers/skill.js";
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.post("/addSkill", secure, addSkill);
router.get("/getSkills", secure, getSkills);
router.get("/getSkillById/:id", secure, getSkillById);
router.put("/updateSkill/:id", secure, updateSkill);
router.delete("/deleteSkill/:id", secure, deleteSkill);


export default router;