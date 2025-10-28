import Asset from '../models/asset.js'
import User from "../models/user.js"
import cloudinary from "../utils/cloudinary.js"

const createAsset = async (req, res) => {
    try {
        let url = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            url = result.secure_url;
        }
        const asset = new Asset({
            url: url,
            public_id: url,
            provider: "cloudinary",
            mimeType: "pdf",
            size: req.file.size,
        });
        await asset.save();
        res.status(200).json({message: "Asset created successfully"});
    } catch (error) {
        console.log(`Error in createAsset controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAssets = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }
        const assets = await Asset.find();
        if (assets) {
            res.status(200).json({assets});
        } else {
            res.status(404).json({message: "No assets found"});
        }

        if (!assets) {
            return res.status(401).json({message: "No assets found"});
        }

        res.status(200).json({assets, message: "All assets fetched successfully"});
    } catch (error) {
        console.log(`Error in getAsset controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAssetsById = async (req, res) => {
    try {
        const id = req.params.id;
        const asset = await Asset.findById(id);
        if (!asset) {
            return res.status(401).json({message: "No asset found"});
        }
        res.status(200).json({asset, message: "Asset fetched successfully"});
    } catch (error) {
        console.log(`Error in getAssetById controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateAsset = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(`Error in updateAsset controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}