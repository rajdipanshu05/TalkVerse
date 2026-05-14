// import dotenv from "dotenv"
// dotenv.config();
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";



export const signup = async (req,res) =>{
    const {fullName, email , password} = req.body;
    const name = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    try {
        if(!name || !normalizedEmail || !password){
            return res.status(400).json({message : "All fields are required"})
        }
    
        if(password.length<6){
            return res.status(400).json({message : "Password must be atleast 6 characters"})
        }
    
        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }
        // const user = User.findOne({email:email}) or
        const user = await User.findOne({email : normalizedEmail})
    
        if(user) return res.status(400).json({message : "Email already Exists"});
    
        // hashing 1234556 => *@FWWW#@$@#$@
        // const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,10);
    
        const newUser = new User({
            fullName : name,
            email : normalizedEmail,
            password : hashedPassword
        })
    
        if(newUser){
            const savedUser = await newUser.save();
            generateToken(newUser._id, res)
            
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic
            })

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
            } catch (error) {
                console.log("Failed to send Welcome Email!!", error);
                
            }
        } else {
            res.status(400).json({message : "Invalid User Data"})
        }
    
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}