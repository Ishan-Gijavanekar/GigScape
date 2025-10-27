import jwt from 'jsonwebtoken';

const secure = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log(`Error in protected middleware: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
} 

export {secure};