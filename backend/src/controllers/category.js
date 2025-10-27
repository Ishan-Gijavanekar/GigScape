import Category from "../models/category.js";
import User from "../models/user.js"

const addCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(402).josn({message: "Unauthorized"});
        }
        const {name, slug, description} = req.body;

        if (!name || !description) {
            return res.status(401).josn({message: "Name and desc are required"});
        }

        const category = new Category({
            name,
            slug: slug || "",
            description,
        });

        await category.save();

        return res.status(200).josn({
            category,
            message: "Category added successfully"
        })
    } catch (error) {
        console.log(`Error in addCategory controller: ${error}`);
        return res.status(500).josn({message: "Internal server error"});
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            return res.status(401).josn({message: "No category found"});
        }

        return res.status(200).josn({
            categories,
            message: "All categories fetched"
        });
    } catch (error) {
        console.log(`Error in getAllCategories controller: ${error}`);
        return res.status(500).josn({message: "Internal server error"});
    }
}

const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(401).josn({message: "Category not found"});
        }

        return res.status(200).josn({
            category,
            message: "Category fetched successfully"
        });
    } catch (error) {
        console.log(`Error in getCategoryById controller: ${error}`);
        return res.status(500).josn({message: "Internal server error"});
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const {name, slug, description} = req.body;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(402).josn({message: "Unauthorized"});
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(401).josn({message: "Category not found"});
        }

        if (name) category.name = name;
        if (slug) category.slug = slug;
        if (description) category.description = description;

        await category.save();

        return res.status(200).josn({
            category,
            message: "Category updated successfully"
        });
    } catch (error) {
        console.log(`Error in updateCategory controller: ${error}`);
        return res.status(500).josn({message: "Internal server error"});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(402).josn({message: "Unauthorized"});
        }

        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(401).josn({message: "Category not found"});
        }

        await Category.findByIdAndDelete(id);
        return res.status(200).josn({message: "Category deleted"});
    } catch (error) {
        console.log(`Error in deleteCategory controller: ${error}`);
        return res.status(500).josn({message: "Internal server error"});
    }
}

export {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}