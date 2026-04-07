import express from "express";
import { sendMessage } from "../routes/message.route.js";

const router = express.Router();

router.get("/send", sendMessage);

export default router;
