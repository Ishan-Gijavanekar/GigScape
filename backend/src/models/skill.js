import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
        index: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }
}, {
    timestamps: true,
});

const Skill = mongoose.model("Skill", SkillSchema);
export default Skill;