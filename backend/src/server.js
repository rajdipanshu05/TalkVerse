// const express = require("express")
import express from "express"
// import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors"


// dotenv.config();

const app = express();

const PORT = ENV.PORT || 3000;

//payload too large error
app.use(express.json()); //req.body
app.use(cors({origin : "http://localhost:5173", credentials : true}))
app.use(cookieParser());




app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoutes);

connectDB()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server is Listening on Port : ${PORT}`);
            ;
        })
    })
    .catch((err)=>{
        console.error("Failed to connect DB : ",err);
        process.exit(1);
        
    })