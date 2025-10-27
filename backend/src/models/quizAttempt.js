import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    answer: mongoose.Schema.Types.Mixed,
    marksObtained: Number
}, {
    _id: false,
});

const QuizAttempSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    answers: [AnswerSchema],
    totalScore: Number,
    passed: Boolean,
    startedAt: Date,
    finisedAt: Date,
    duration: Number
}, {
    timestamps: true,
});

const Quizattemp = mongoose.model("Quizattempt", QuizAttempSchema);
export default Quizattemp;