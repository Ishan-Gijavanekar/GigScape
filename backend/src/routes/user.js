import express from 'express'
import { registerUser, verifyEmail, loginUser, logout, forgetPassword, resetPassword, changePassword, getProfile, uploadPortfolio, updatePhoto, deleteUser } from '../controllers/user.js';
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyEmail/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/logout",secure, logout);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/changePassword", changePassword);
router.get("/getProfile",secure, getProfile);
router.post("/uploadPortfolio",secure, uploadPortfolio);
router.post("/updatePhoto",secure, updatePhoto);
router.delete("/deleteUser",secure, deleteUser);


export default router;