import mongoose from "mongoose"
import { ENV } from "./env.js";

export const connectDB = async () =>{
    try {
        const {MONGO_URI} = ENV;
        if(!MONGO_URI) throw new Error("MONGO_URI is not set");
        const conn = await mongoose.connect(`${MONGO_URI}/talkverse`)
        console.log(`\n MongoDB connected !! DB Host : ${conn.connection.host}`);
    } catch (error) {
        console.error("Error while connecting to mongoDB", error)
        process.exit(1) // 1 status means failure and 0 means success
    }
}