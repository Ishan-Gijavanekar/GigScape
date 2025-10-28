import express from 'express';
import { startAttempt, submitAttempt, getAllAttempts, getAttemptById, getMyAttempts } from "../controllers/quizAttempt.js";
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.route("/startAttempt").post(secure, startAttempt);
router.route("/submitAttempt").post(secure, submitAttempt);
router.route("/getAllAttempts").get(secure, getAllAttempts);
router.route("/getAttemptById/:id").get(secure, getAttemptById);
router.route("/getMyAttempts").get(secure, getMyAttempts);


export default router;;