import { Favorite } from "../models/favorite.model.js";
import { User } from "../models/user.model.js";

export const getFavorites = async (req, res, next) => {
	try {
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Lấy danh sách yêu thích của User hiện tại
		const favorites = await Favorite.find({ userId: user._id });
		res.json(favorites);
	} catch (error) {
		next(error);
	}
};

export const toggleFavorite = async (req, res, next) => {
	try {
		const { targetId, targetType } = req.body;
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Kiểm tra xem đã tồn tại trong danh sách yêu thích chưa
		const existingFavorite = await Favorite.findOne({
			userId: user._id,
			targetId,
			targetType,
		});

		if (existingFavorite) {
			// Nếu đã thích rồi thì xóa đi (Unlike)
			await Favorite.findByIdAndDelete(existingFavorite._id);
			res.status(200).json({ message: "Removed from favorites", isFavorite: false });
		} else {
			// Nếu chưa thích thì thêm mới (Like)
			const favorite = await Favorite.create({
				userId: user._id,
				targetId,
				targetType,
			});
			res.status(201).json({ ...favorite.toJSON(), isFavorite: true });
		}
	} catch (error) {
		console.log("Error in toggleFavorite", error);
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

