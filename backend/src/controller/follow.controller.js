import { Router } from "express";
import { getFollows, createFollow, deleteFollow } from "../routes/follow.route.js";

const router = Router();

router.get("/", getFollows);
router.post("/", createFollow);
router.delete("/:id", deleteFollow);

export default router;
