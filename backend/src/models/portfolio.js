import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    title: String,
    description: String,
    assets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
    }],
    githubLink: String,
    demoLink: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;