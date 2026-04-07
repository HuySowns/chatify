import { Router } from "express";
import { getComments, createComment, deleteComment } from "../routes/comment.route.js";

const router = Router();

router.get("/", getComments);
router.post("/", createComment);
router.delete("/:id", deleteComment);

export default router;
