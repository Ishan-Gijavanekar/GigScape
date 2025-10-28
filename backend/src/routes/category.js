import express from 'express'
import { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.js";
import { secure } from '../middlewares/auth.js';

const router = express.Router();


router.post("/category", secure, addCategory);
router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", secure, updateCategory);
router.delete("/category/:id", secure, deleteCategory);


export default router