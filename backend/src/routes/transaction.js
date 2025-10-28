import express from 'express';
import { createStripePaymentIntent, confirmStripePayment, refundStripePayment, createManualTransaction, getTransactionById, getUserTransactions, getAdminTransactionStats, updateTransactionStatus } from "../controllers/transaction.js";
import { secure } from '../middlewares/auth.js';


const router = express.Router();

router.post("/createStripePaymentIntent", secure, createStripePaymentIntent);
router.post("/confirmStripePayment", secure, confirmStripePayment);
router.post("/refundStripePayment", secure, refundStripePayment);
router.post("/createManualTransaction", secure, createManualTransaction);
router.get("/getTransactionById/:id", secure, getTransactionById);
router.get("/getUserTransactions", secure, getUserTransactions);
router.get("/getAdminTransactionStats", secure, getAdminTransactionStats);
router.put("/updateTransactionStatus/:id", secure, updateTransactionStatus);



export default router;