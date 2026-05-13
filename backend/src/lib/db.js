import mongoose from "mongoose"


export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/talkverse`)
        console.log(`\n MongoDB connected !! DB Host : ${conn.connection.host}`);
    } catch (error) {
        console.error("Error while connecting to mongoDB", error)
        process.exit(1) // 1 status means failure and 0 means success
    }
}