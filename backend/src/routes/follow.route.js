import { Follow } from "../models/follow.model.js";

export const getFollows = async (req, res, next) => {
    try {
        const follows = await Follow.find();
        res.json(follows);
    } catch (error) {
        next(error);
    }
};

export const createFollow = async (req, res, next) => {
    try {
        const { followingId } = req.body;
        const followerId = req.auth?.userId || req.body.followerId; 
        const follow = await Follow.create({ followerId, followingId });
        res.status(201).json(follow);
    } catch (error) {
        next(error);
    }
};

export const deleteFollow = async (req, res, next) => {
    try {
        await Follow.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Follow deleted" });
    } catch (error) {
        next(error);
    }
};
