import express from 'express'
import { createWallet, getWallet, getWalletBalance, depositFunds, withdrawFunds, holdFunds, releseHolds, getWalletTransactions } from "../controllers/wallet.js";
import { secure } from '../middlewares/auth.js';


const router = express.Router();

router.post("/createWallet", secure, createWallet);
router.get("/getWallet", secure, getWallet);
router.get("/getWalletBalance", secure, getWalletBalance);
router.post("/depositFunds", secure, depositFunds);
router.post("/withdrawFunds", secure, withdrawFunds);
router.post("/holdFunds", secure, holdFunds);
router.post("/releseHolds", secure, releseHolds);
router.get("/getWalletTransactions", secure, getWalletTransactions);


export default router;