import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { io } from "../lib/socket.js";

export const getAllContacts = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id : { $ne : loggedInUserId}}).select("-password")
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error while getting contacts");
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const getMessageByUserId = async (req,res)=>{
    try {
        const myId = req.user._id;
        const {id : userToChat} = req.params;

        //me and you
        //i send you the message
        //you send me the message

        const message = await Message.find({
            $or :[
                {senderId:myId, receiverId :userToChat},
                {senderId:userToChat, receiverId: myId}
            ]
        })
        res.status(200).json(message);

    } catch (error) {
        console.log("Error in getMessage controller :", error);
        res.status(500).json({message: "Internal Server Error"});
        
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {text, image} = req.body;
        const { id : receiverId} = req.params;
        const senderId = req.user._id;

        if(!text && !image){
            return res.status(400).json({message : "Text or Image is required"});
        }

        if(senderId.equals(receiverId)){
            return res.status(400).json({message : "Can't send message to yourself"});
        }

        const receiverExists = await User.exists({_id : receiverId});
        if(!receiverExists){
            return res.status(400).json({message : "Receiver Not found."});
        }

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message(
            {
                senderId,
                receiverId,
                text,
                image : imageUrl
            }
        )

        await newMessage.save()

        //todo: send message in realtime if user is online -socket.io
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller :", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getChatPartners = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;

        //find all the messages where loggedIn user is either sender or receiver
        const messages = await Message.find({
            $or : [{senderId: loggedInUserId}, {receiverId : loggedInUserId}]
        })

        const chatPartnersId = [...new Set(messages.map((msg) => 
            msg.senderId.toString() == loggedInUserId.toString() ?
            msg.receiverId.toString() : msg.senderId.toString()
        ))];

        const chatPartners= await User.find({
            _id : {$in : chatPartnersId}
        }).select("-password")

        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("error in getChatPartners Controller : ",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}