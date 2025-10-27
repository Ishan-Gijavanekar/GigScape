import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    mimiType: String,
    size: Number,
}, {
    _id: false,
});

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: 'text',
    },
    description: {
        type: String,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    budgetType: {
        type: String,
        enum: ['fixed', 'hourly'],
        default: 'fixed',
    },
    budgetMin: {type: Number},
    fixedBudget: {type: Number},
    currency: {type: String, default: "inr"},
    durationWeeks: Number,
    attachment: {type: attachmentSchema},
    remote: {type: Boolean, default: true},
    location: {type: String},
    status: {
        type: String,
        enum: ['draft', 'published', 'open', 'in_progress','completed','cancelled','expired'],
        default: 'published'
    },
    praposalCount: {type: Number, default: 0},
    views: {
        type: Number,
        default: 0
    },
    expiresAt: Date,
    featured: {type: Boolean, default: false},
}, {
    timestamps: true,
});

jobSchema.index({ title: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);
export default Job;