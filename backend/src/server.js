// const express = require("express")
import express from "express"
// import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { app,server } from "./lib/socket.js";

// dotenv.config();

const PORT = ENV.PORT || 3000;

//payload too large error
app.use(express.json({limit:"5mb"})); //req.body
app.use(
  cors({
    origin: "https://talkverse-p97r.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());




app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoutes);

connectDB()
    .then(()=>{
        server.listen(PORT,()=>{
            console.log(`Server is Listening on Port : ${PORT}`);
            ;
        })
    })
    .catch((err)=>{
        console.error("Failed to connect DB : ",err);
        process.exit(1);
        
    })