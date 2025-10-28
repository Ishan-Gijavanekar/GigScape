import express from 'express';
import { createQuiz, publishQuiz, getAllQuizes, getQuizById, getQuizByCategory, updateQuiz, deleteQuiz } from "../controllers/quiz.js";
import { secure } from '../middlewares/auth.js';


const router = express.Router();

router.route("/createQuiz").post(secure, createQuiz);
router.route("/publishQuiz/:id").put(secure, publishQuiz);
router.route("/getAllQuizes").get(secure, getAllQuizes);
router.route("/getQuizById/:id").get(secure, getQuizById);
router.route("/getQuizByCategory/:category").get(secure, getQuizByCategory);
router.route("/updateQuiz/:id").put(secure, updateQuiz);
router.route("/deleteQuiz/:id").delete(secure, deleteQuiz);


export default router;