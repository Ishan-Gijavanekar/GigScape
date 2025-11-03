import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    coordinate: {
        type: [Number],
        index: '2dsphere',
    }
}, {
    _id: false
});

const SocialSchema = new mongoose.Schema({
    github: {
        type: String,
    },
    linkdin: {
        type: String,
    },
    website: {
        type: String
    }
}, {
    _id: false
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['client', 'freelancer', 'admin'],
        required: true,
    },
    name: {
        first: {type: String},
        last: {type: String},
        displayName: {type: String}
    },
    bio: {
        type: String,
        maxLength: 2000
    },
    avatar: {
        url: {type: String},
        public_id: {type: String},
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
    }],
    hourlyRate: {
        type: Number,
    },
    company: {
        name: String,
        website: String,
    },
    location: {
        type: LocationSchema
    },
    social: {
        type: SocialSchema,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"
    },
    stats: {
        earning: {
            type: Number,
            default: 0,
        },
        completedJobs: {
            type: Number,
            default: 0,
        },
        successRate: {
            type: Number,
            default: 0,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date
    },
    emailToken: {
        type: String,
    }
},{
    timestamps: true,
});

UserSchema.index({'name.diaplayName': 'text', bio: 'text'});

const User = mongoose.model("User", UserSchema);
export default User;