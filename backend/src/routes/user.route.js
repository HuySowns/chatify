import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
	getAllUsers, 
	getMessages, 
	updatePlaybackPosition, 
	getPlaybackPosition 
} from "../controller/user.controller.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.post("/playback-position", protectRoute, updatePlaybackPosition);
router.get("/playback-position", protectRoute, getPlaybackPosition);

export default router;
