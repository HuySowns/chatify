import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

// Helper function for cloudinary uploads (copied from admin for consistency)
const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};

/**
 * @desc Get all playlists for the authenticated user
 * @route GET /api/playlists
 */
export const getPlaylists = async (req, res, next) => {
	try {
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		const playlists = await Playlist.find({ userId: user._id }).populate("songs");
		res.json(playlists);
	} catch (error) {
		next(error);
	}
};

/**
 * @desc Create a new playlist with optional image
 * @route POST /api/playlists
 */
export const createPlaylist = async (req, res, next) => {
	try {
		const { title, description } = req.body;
		const imageFile = req.files?.imageFile;
		const clerkId = req.auth?.userId;

		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found in DB" });

		let imageUrl = null;
		if (imageFile) {
			imageUrl = await uploadToCloudinary(imageFile);
		}

		const playlist = await Playlist.create({
			title,
			description,
			imageUrl, // Lưu URL ảnh từ Cloudinary
			userId: user._id,
		});

		res.status(201).json(playlist);
	} catch (error) {
		next(error);
	}
};

/**
 * @desc Update playlist details (title, description, image)
 * @route PUT /api/playlists/:id
 */
export const updatePlaylist = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, description } = req.body;
		const imageFile = req.files?.imageFile;

		let updateData = { title, description };

		if (imageFile) {
			const imageUrl = await uploadToCloudinary(imageFile);
			updateData.imageUrl = imageUrl;
		}

		const playlist = await Playlist.findByIdAndUpdate(id, updateData, { new: true });

		if (!playlist) return res.status(404).json({ message: "Playlist not found" });

		res.json(playlist);
	} catch (error) {
		next(error);
	}
};

export const deletePlaylist = async (req, res, next) => {
	try {
		await Playlist.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Playlist deleted" });
	} catch (error) {
		next(error);
	}
};

export const addSongToPlaylist = async (req, res, next) => {
	try {
		const { playlistId } = req.params;
		const { songId } = req.body;

		// Tìm playlist và thêm songId vào mảng songs
		const playlist = await Playlist.findByIdAndUpdate(
			playlistId,
			{ $addToSet: { songs: songId } }, // $addToSet để không thêm trùng bài hát
			{ new: true }
		).populate("songs"); // Trả về kèm thông tin bài hát để UI cập nhật ngay

		if (!playlist) return res.status(404).json({ message: "Playlist not found" });

		res.json(playlist);
	} catch (error) {
		next(error);
	}
};

