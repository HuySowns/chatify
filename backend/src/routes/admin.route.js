import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// Helper function để upload file lên Cloudinary
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

export const createSong = async (req, res, next) => {
	try {
		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload all files" });
		}

		const { title, artist, albumId, genreId, duration } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
			genreId: genreId || null, // MỚI: Thêm thể loại khi tạo
		});

		await song.save();

		// Nếu bài hát thuộc album, cập nhật mảng songs của album đó
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}
		res.status(201).json(song);
	} catch (error) {
		console.log("Error in createSong", error);
		next(error);
	}
};

// MỚI: Cấu trúc cập nhật bài hát (Hỗ trợ đổi Metadata & Files)
export const updateSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, artist, albumId, genreId, duration } = req.body;
		
		const song = await Song.findById(id);
		if (!song) return res.status(404).json({ message: "Song not found" });

		let updateData = {
			title,
			artist,
			duration: duration || song.duration,
			albumId: albumId === "none" ? null : (albumId || song.albumId),
			genreId: genreId === "none" ? null : (genreId || song.genreId),
		};

		// 1. Xử lý thay đổi Album (Nếu có)
		if (albumId && albumId !== song.albumId?.toString()) {
			// Xóa ID bài hát khỏi Album cũ
			if (song.albumId) {
				await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
			}
			// Thêm ID bài hát vào Album mới
			if (albumId !== "none") {
				await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
			}
		}

		// 2. Xử lý upload Audio mới (Nếu có)
		if (req.files?.audioFile) {
			const audioUrl = await uploadToCloudinary(req.files.audioFile);
			updateData.audioUrl = audioUrl;
		}

		// 3. Xử lý upload Image mới (Nếu có)
		if (req.files?.imageFile) {
			const imageUrl = await uploadToCloudinary(req.files.imageFile);
			updateData.imageUrl = imageUrl;
		}

		const updatedSong = await Song.findByIdAndUpdate(id, updateData, { new: true });
		res.status(200).json(updatedSong);
	} catch (error) {
		console.log("Error in updateSong", error);
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);

		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);
		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

// ... giữ nguyên phần Album
export const createAlbum = async (req, res, next) => {
	try {
		const { title, artist, releaseYear } = req.body;
		const { imageFile } = req.files;

		const imageUrl = await uploadToCloudinary(imageFile);

		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear,
		});

		await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Error in createAlbum", error);
		next(error);
	}
};

export const updateAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, artist, releaseYear } = req.body;
		const imageFile = req.files?.imageFile;

		let updateData = {
			title,
			artist,
			releaseYear,
		};

		if (imageFile) {
			const imageUrl = await uploadToCloudinary(imageFile);
			updateData.imageUrl = imageUrl;
		}

		const album = await Album.findByIdAndUpdate(id, updateData, { new: true });

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		console.log("Error in updateAlbum", error);
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
