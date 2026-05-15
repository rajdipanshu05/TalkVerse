import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllContacts, getMessageByUserId, sendMessage,getChatPartners } from "../controllers/message.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router()
router.use(arcjetProtection,protectRoute);

router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners) // /:id waala iske niche hi hona chahiye wrna fir whi catch ho jyega
router.get("/:id", getMessageByUserId)
router.post("/send/:id", sendMessage)


export default router;