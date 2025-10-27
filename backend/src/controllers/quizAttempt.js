import Quiz from "../models/quiz.js";
import Quizattempt from "../models/quizAttempt.js";
import User from "../models/user.js";

const startAttempt = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(401).json({message: "Quiz not found"});
        }

        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role === 'client') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const attempt = new Quizattempt({
            quiz: quizId,
            user: userId,
            startedAt: Date.now(),
        });

        await attempt.save();

        res.status(200).json({attempt, message: "Attempt started successfully"});
    } catch (error) {
        console.log(`Error in startAttempt controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const submitAttempt = async (req, res) => {
    try {
        const {answers} = req.body;
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(401).json({message: "Quiz not found"});
        }

        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role === 'client') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const attempt = await Quizattempt.findOne({quiz: quizId, user: userId});
        if (!attempt) {
            return res.status(401).json({message: "Attempt not found"});
        }

        if (attempt.finisedAt) {
            return res.status(401).json({message: "Attempt already submitted"});
        }

        let totalScore = 0;
        const evaluatdAnswers = [];

        attempt.quiz.questions.forEach((q) => {
            const userAnswer = answers.find((a) => {
                return a.questionId.toString() === q._id.toString();
            });
            let marks = 0;
            if (userAnswer) {
                if (q.type === 'mcq' || q.type === 'multi-select') {
                    const correctIds = q.options
                        .filter((opt) => opt.isCorrect)
                        .map((opt) => opt._id.toString());
                    
                    
                    const userIds = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer];
                    const isCorrect = JSON.stringify([...correctIds]) === JSON.stringify([...userIds].sort());
                    marks = isCorrect ? q.points : 0;
                } else if (q.type === 'short-answer') {
                    marks = userAnswer.answer.trim().toLowerCase() === q.answer.trim().toLowerCase() ? q.points : 0;
                } else if (q.type === 'codeing') {
                    marks = userAnswer.answer.trim().toLowerCase() === q.answer.trim().toLowerCase() ? q.points : 0;
                }
            }

            totalScore += marks;
            evaluatdAnswers.push({
                questionId: q._id,
                answer: userAnswer ? userAnswer.answer : null,
                marksObtained: marks,
            });
        });

        attempt.answers = evaluatdAnswers;
        attempt.totalScore = totalScore;
        attempt.passed = totalScore >= quiz.minScore;
        attempt.finisedAt = Date.now();
        attempt.duration = (attempt.finisedAt - attempt.startedAt) / 1000;

        await attempt.save();

        res.status(200).json({attempt, message: "Attempt submitted successfully"});

    } catch (error) {
        console.log(`Error in submitAttempt controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getMyAttempts = async (req, res) => {
    try {
        const usereId = req.user.userId;
        const user = await User.findById(usereId);
        if (!user && user.role === 'client') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(401).json({message: "Quiz not found"});
        }

        const attempts = await Quizattempt.find({user: usereId, quiz: quizId})
            .populate("quiz", "title description");
    } catch (error) {
        console.log(`Error in getMyAttempts controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAttemptById = async (req, res) => {
    try {
        const attempt = await Quizattempt.findById(req.params.id)

        if (!attempt) {
            return res.status(401).json({message: "Attempt not found"});
        }

        if (attempt.user.toString() !== req.user.userId || attempt.quiz.createdBy.toString() !== req.user.userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        res.status(200).json({attempt, message: "Attempt fetched successfully"});
    } catch (error) {
        console.log(`Error in getAttemptById controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAllAttempts = async (req, res) => {
    try {
        const userid = req.user.userId;
        const user = await User.findById(userid);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const attempts = await Quizattempt.find().populate("quiz", "title description");

        if (!attempts) {
            return res.status(401).json({message: "No attempts found"});
        }

        res.status(200).json({attempts, message: "All attempts fetched successfully"});
    } catch (error) {
        console.log(`Error in getAllAttempts controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    startAttempt,
    submitAttempt,
    getMyAttempts,
    getAttemptById,
    getAllAttempts
}