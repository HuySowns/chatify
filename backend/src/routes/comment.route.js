import { Comment } from "../models/comment.model.js";

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

export const createComment = async (req, res, next) => {
    try {
        const { songId, albumId, content } = req.body;
        const userId = req.auth?.userId || req.body.userId; 
        const comment = await Comment.create({ userId, songId, albumId, content });
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        next(error);
    }
};
