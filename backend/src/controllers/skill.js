import Skill from '../models/skill.js';
import User from '../models/user.js';

const addSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const {name, slug, category} = req.body;
        if (!name || !category) {
            return res.status(401).json({message: "Name and category are reqquired"});
        }

        const skill = new Skill({
            name,
            slug: slug || "",
            category,
        });

        await skill.save();
        return res.status(200).json({
            skill,
            message: "Skill Added successfully"
        });
    } catch (error) {
        console.log(`Error in addSkill controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getSkills = async (req, res) => {
    try {
        const fliters = {};
        
        if (req.query.name) fliters.name = req.query.name;
        if (req.query.slug) fliters.slug = req.query.slug;
        if (req.query.categoryName) fliters.category.name = categoryName;

        const skills = await Skill.find(fliters)
        .populate("category", "name");

        if (!skills) {
            return res.status(401).json({message: "No skills found"});
        }

        return res.status(200).json({
            skills,
            message: "All skills fetched"
        });
    } catch (error) {
        console.log(`Error in getSkills controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getSkillById = async (req, res) => {
    try {
        const id= req.params.id;
        const skill = await Skill.findById(id)
            .populate("category", "name");
        if (!skill) {
            return res.status(401).json({message: "No skill found"});
        }

        return res.status(200).json({
            skill,
            message: "Skill fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getSkillById controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }
        const skill = await Skill.findById(req.params.id)
        if (!skill) {
            return res.status(401).json({message: "No skill found"});
        }
        const {name, slug, category} = req.body;
        if (!name || !category) {
            return res.status(401).json({message: "Name and category are reqquired"});
        }

        if (name)  skill.name = name;
        if (slug)  skill.slug = slug;
        if (category) skill.category = category;

        await skill.save();

        res.status(200).json({
            skill,
            message: "Skill updated successfully"
        });
    } catch (error) {
        console.log(`Error in updateSkill controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }
        const skill = await Skill.findById(req.params.id)
        if (!skill) {
            return res.status(401).json({message: "No skill found"});
        }

        await Skill.findByIdAndDelete(req.params.id);

        return res.status(200).json({message: "Skill deleted successfully"});
    } catch (error) {
        console.log(`Error in deleteSkill controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export {
    addSkill,
    getSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
}