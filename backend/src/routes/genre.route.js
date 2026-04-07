import { Genre } from "../models/genre.model.js";

export const getGenres = async (req, res, next) => {
	try {
		const genres = await Genre.find().sort({ name: 1 });
		res.json(genres);
	} catch (error) {
		console.log("Error in getGenres", error);
		next(error);
	}
};

export const createGenre = async (req, res, next) => {
	try {
		const { name, description, imageUrl } = req.body;
		if (!name) return res.status(400).json({ message: "Name is required" });

		const genre = await Genre.create({ name, description, imageUrl });
		res.status(201).json(genre);
	} catch (error) {
		console.log("Error in createGenre", error);
		next(error);
	}
};

// MỚI: Tính năng cập nhật thể loại nhạc (Admin only)
export const updateGenre = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, description, imageUrl } = req.body;

		const genre = await Genre.findByIdAndUpdate(
			id,
			{ name, description, imageUrl },
			{ new: true }
		);

		if (!genre) return res.status(404).json({ message: "Genre not found" });

		res.status(200).json(genre);
	} catch (error) {
		console.log("Error in updateGenre", error);
		next(error);
	}
};

export const deleteGenre = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Genre.findByIdAndDelete(id);
		res.status(200).json({ message: "Genre deleted successfully" });
	} catch (error) {
		console.log("Error in deleteGenre", error);
		next(error);
	}
};
