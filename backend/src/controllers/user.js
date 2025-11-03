import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {sendEmail} from '../utils/email.js';
import bcrypt from 'bcryptjs'
import {cloudinary} from "../utils/cloudinary.js"

const generateToken = (id, role) => {
    const token = jwt.sign(
        {
            userId: id,
            role,
        },
        process.env.JWT_KEY,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );

    return token
};

const registerUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        if (!name || !email || !password || !role) {
            return res.status(401).json({message: "All fields are required"});
        }

        const userExsists = await User.findOne({email});
        if (userExsists) {
            return res.status(401).json({message: "User already exsists"});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            emailToken: verificationToken,
            isVerified: false,
        });

        await user.save();

        const verifyUrl = `https://localhost:5000/verify/${verificationToken}`;
        await sendEmail({
            to: email,
            subject: "Verify Your Email Address",
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
                <h2 style="color: #333333;">Welcome to GigScape 🎉</h2>
                <p style="font-size: 16px; color: #555555;">
                Thanks for signing up! To get started, please verify your email address by clicking the button below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Verify Email
                </a>
             </div>
             <p style="font-size: 14px; color: #888888;">
               If the button doesn't work, you can also copy and paste this link into your browser:
             </p>
             <p style="font-size: 14px; color: #007bff; word-break: break-all;">
               ${verifyUrl}
             </p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 40px 0;">
                <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                  If you didn’t sign up for GigScape, you can safely ignore this email.
                 </p>
            </div>
            </div>
        `,
        text: `Thanks for signing up! Please verify your email by visiting: ${verifyUrl}`,
        });

        return res.status(200).json({
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.log(`Error in register controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const verifyEmail = async(req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({emailToken: token});
        if (!user) {
            return res.status(401).json({message: "Invalid token"});
        }

        user.isVerified = true;
        user.emailToken = null;
        await user.save();

        return res.status(200).json({message: "Email verified Successfully"});
    } catch (error) {
        console.log(`Error in verifyEmail controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(401).json({message: 'All fields are required'});
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(200).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json({message: "Invalid credentials"});
        }
        if (!user.isVerified) {
            return res.status(200).json({message: "Email not verified."});
        }

        const token = generateToken(user._id, user.role);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })

        res.status(200).json({
            user: user.email,
            token,
            message: "Login Successfull"
        });

    } catch (error) {
        console.log(`Error in login controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const logout = async(req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        res.status(200).json({message: "Logout Successfull"});
    } catch (error) {
        console.log(`Error in logout controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: "No user found"});
        }
        const token = crypto.randomBytes(32).toString("hex");
        user.emailToken = token;
        await user.save();

        const resetUrl = `http://localhost:5000/reset-password/${token}`;
        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            html: `<p> Click <a herf=${resetUrl}> here </a> to reset your password</p>`,
            text: "This email is in regard to reset the password"
        });

        res.status(200).json({message: "Password reste email sent"});
    } catch (error) {
        console.log(`Error in forgetPassword Controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const resetPassword = async(req, res) => {
    try {
        const {token} = req.params;
        const password = req.body.password;
        const user = await User.findOne({emailToken: token});
        if (!user) {
            return res.status(401).json({message: "Invalid token"});
        }

        user.password = await bcrypt.hash(password, 12);
        user.emailToken = null;
        await user.save();

        res.status(200).json({message: "Password reset successfull"});
    } catch (error) {
        console.log(`Error in reset password controller: ${error}`);
        return res.status(500).json({message: "Internal; server error"});
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const {password} = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: "Incorrect Old Password"});
        }
        user.password = await bcrypt.hash(password, 12);
        await user.save();

        res.status(200).json({message: "Password changed successfully"});
    } catch (error) {
        console.log(`Error in change password controller: ${error}`);
        return res.status(500).json({message: "Internal; server error"});
    }
} 

const getProfile = async(req, res) => {
    try {
        const userId = req.user?.userId;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        res.status(200).json({
            user,
            message: "User fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getProfile controller: ${error}`);
        return res.status(500).json({message: "Internal; server error"});
    }
}

const uploadPortfolio = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const {bio, skills, hourlyRate, company, location, social} = req.body;
        if (bio) user.bio = bio;
        if (skills) user.skills = [...user.skills, skills];
        if (hourlyRate && user.role === 'freelancer') user.hourlyRate = hourlyRate;
        if (company && user.role === 'client') user.company = company;
        if (location) {
            if (!location.city || !location.state || !location.country) {
                return res.status(404).json({message: "Location not in proper format"})
            }
            user.location = location;
        }
        if (social) {
            if (social.github) user.social.github = social.github;
            if (social.linkedin) user.social.linkdin = social.linkdin;
            if (social.website) user.social.website = social.website;
        }

        await user.save();
        res.state(200).json({
            user,
            message: "Portfolio uploaded successfully"
        });
    } catch (error) {
        console.log(`Error in uploading portfolio controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updatePhoto = async(req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        let url = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            url = result.secure_url;
        }

        user.avatar.url = url;
        user.avatar.public_id = url;

        await user.save();
        res.status(200).json({message: "Photo uploaded successfully"});
    } catch (error) {
        console.log(`Error in upldating the photo: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user && user.role === 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        console.log(`Error in delete user controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    registerUser,
    verifyEmail,
    loginUser,
    logout,
    forgetPassword,
    resetPassword,
    changePassword,
    getProfile,
    uploadPortfolio,
    updatePhoto,
    deleteUser,
}