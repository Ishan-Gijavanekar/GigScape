import User from "../models/user.js";
import Quiz from "../models/quiz.js";
import Category from '../models/category.js';

const createQuiz = async (req, res) => {
    try {
        const userid = req.user.userId;
        const user = await User.findById(userid);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }
        const { title, description, category, questions } = req.body;
        const newQuiz = new Quiz({
            title,
            description,
            category,
            questions,
            createdBy: userid
        });
        const savedQuiz = await newQuiz.save();
        res.status(200).json({savedQuiz, message: "Quiz created successfully"});
    } catch (error) {
        console.log(`Error in createQuiz controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const publishQuiz = async (req, res) => {
    try {
        const userid = req.user.userId;
        const user = await User.findById(userid);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if (!quiz && quiz.createdBy.toString() !== userid) {
            return res.status(401).json({message: "Quiz not found"});
        }

        quiz.isPublished = true;
        const savedQuiz = await quiz.save();
        res.status(200).json({savedQuiz, message: "Quiz published successfully"});
    } catch (error) {
        console.log(`Error in publishQuiz controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAllQuizes = async (req, res) => {
    try {
        const userid = req.user.userId;
        const user = await User.findById(userid);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const quizes = await Quiz.find({isPublished: true})
            .populate("createdBy", "name")
            .populate("category", "name");

        if (!quizes) {
            return res.status(401).json({message: "No quizes found"});
        }

        res.status(200).json({quizes, message: "All quizes fetched successfully"});
    } catch (error) {
        console.log(`Error in getAllQuizes controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId)
            .populate("createdBy", "name")
            .populate("category", "name");

        if (!quiz) {
            return res.status(401).json({message: "No quiz found"});
        }

        res.status(200).json({quiz, message: "Quiz fetched successfully"});
    } catch (error) {
        console.log(`Error in getQuizById controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getQuizByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(401).json({message: "No category found"});
        }

        const quizes = await Quiz.find({category: categoryId, isPublished: true})
            .populate("createdBy", "name")
            .populate("category", "name");


        if (!quizes) {
            return res.status(401).json({message: "No quizes found"});
        }

        res.status(200).json({quizes, message: "Quizes fetched successfully"});
    } catch (error) {
        console.log(`Error in getQuizByCategory controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateQuiz = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(401).json({message: "No quiz found"});
        }

        const {title, description, category, questions} = req.body;
        quiz.title = title;
        quiz.description = description;
        quiz.category = category;
        quiz.questions = questions;
        const savedQuiz = await quiz.save();


        res.status(200).json({savedQuiz, message: "Quiz updated successfully"});
    } catch (error) {
        console.log(`Error in updateQuiz controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteQuiz = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(401).json({message: "No quiz found"});
        }

        await Quiz.findByIdAndDelete(id);
        res.status(200).json({message: "Quiz deleted successfully"});
    } catch (error) {
        console.log(`Error in deleteQuiz controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    createQuiz,
    publishQuiz,
    getAllQuizes,
    getQuizById,
    getQuizByCategory,
    updateQuiz,
    deleteQuiz
}