import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { User } from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized - No token provided"});

        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: "Unauthorized - Invalid token"});

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) res.status(404).json({message: "User Not Found"});

        req.user = user;
        next();
    } catch (error) {
        console.log("error in protectRoute middleWare : ",error);
        res.status(500).json({message : "Internal Server Error"})
    }
}