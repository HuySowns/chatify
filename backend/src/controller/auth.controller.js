import { Router } from "express";
import { authCallback, signup, login } from "../routes/auth.route.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/callback", authCallback);

export default router;
