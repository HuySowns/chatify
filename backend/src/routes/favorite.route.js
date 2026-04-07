import { Favorite } from "../models/favorite.model.js";

export const getFavorites = async (req, res, next) => {
    try {
        const userId = req.auth?.userId || req.body.userId;
        const favorites = await Favorite.find({ userId });
        res.json(favorites);
    } catch (error) {
        next(error);
    }
};

export const createFavorite = async (req, res, next) => {
    try {
        const { targetId, targetType } = req.body;
        const userId = req.auth?.userId || req.body.userId; 
        const favorite = await Favorite.create({ userId, targetId, targetType });
        res.status(201).json(favorite);
    } catch (error) {
        next(error);
    }
};

export const deleteFavorite = async (req, res, next) => {
    try {
        await Favorite.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Favorite deleted" });
    } catch (error) {
        next(error);
    }
};
