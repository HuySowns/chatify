import { Genre } from "../models/genre.model.js";

export const getGenres = async (req, res, next) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (error) {
        next(error);
    }
};

export const createGenre = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const genre = await Genre.create({ name, description });
        res.status(201).json(genre);
    } catch (error) {
        next(error);
    }
};

export const deleteGenre = async (req, res, next) => {
    try {
        await Genre.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Genre deleted" });
    } catch (error) {
        next(error);
    }
};
