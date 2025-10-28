import express from 'express';
import { createContract, getContractById, getContracts, updateContract, deleteContract, updateContractStatus, updateEscrowStatus, getMyContracts,   getAdminStats } from "../controllers/contract.js";
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.post("/contract", secure, createContract);
router.get("/contracts", secure, getContracts);
router.get("/contract/:id", secure, getContractById);
router.put("/contract/:id", secure, updateContract);
router.delete("/contract/:id", secure, deleteContract);
router.put("/updateContractStatus/:id", secure, updateContractStatus);
router.put("/updateEscrowStatus/:id", secure, updateEscrowStatus);
router.get("/getMyContracts", secure, getMyContracts);
router.get("/getAdminStats", secure, getAdminStats);


export default router;