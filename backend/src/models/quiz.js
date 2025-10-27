import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    text: String,
    isCorrect: {type: Boolean, default: false},
}, {
    _id: true
});

const QuestionSchema = new mongoose.Schema({
    questionText: {type: String, required: true},
    type: {
        type: String,
        enum: ["mcq", "multi-select", "short-answer", 'codeing'],
        default: "mcq",
    },
    options: [OptionSchema],
    points: {
        type: Number,
        default: 1
    },
    timelimit: Number,
    explanation: String,
}, {
    _id: true,
});

const QuizSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    timeLimit: Number,
    passingPercent: {type: Number, default: 60},
    question: [QuestionSchema],
    publish: {type: Boolean, default: false},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }
}, {
    timestamps: true
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;