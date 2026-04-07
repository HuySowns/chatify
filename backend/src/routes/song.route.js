import { Song } from "../models/song.model.js";
import https from "https";

export const getAllSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		console.error("Error in getAllSongs", error);
		next(error);
	}
};

// MỚI: Lấy danh sách bài hát theo Thể loại (Genre)
export const getSongsByGenre = async (req, res, next) => {
	try {
		const { genreId } = req.params;
		const songs = await Song.find({ genreId }).sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		console.error("Error in getSongsByGenre", error);
		next(error);
	}
};

export const getSongById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);

		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}

		res.json(song);
	} catch (error) {
		console.error("Error in getSongById", error);
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 6 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		console.error("Error in getFeaturedSongs", error);
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		console.error("Error in getMadeForYouSongs", error);
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		console.error("Error in getTrendingSongs", error);
		next(error);
	}
};

export const streamSong = async (req, res, next) => {
	try {
		const song = await Song.findById(req.params.id);
		if (!song) return res.status(404).json({ message: "Song not found" });

		const url = new URL(song.audioUrl);
		const rangeHeader = req.headers.range;

		const options = {
			hostname: url.hostname,
			path: url.pathname + url.search,
			method: "GET",
			headers: { ...(rangeHeader && { Range: rangeHeader }) },
		};

		const request = https.request(options, (response) => {
			const headers = {
				"Content-Type": response.headers["content-type"] || "audio/mpeg",
				"Content-Disposition": "inline",
				"Accept-Ranges": "bytes",
				"Cache-Control": "public, max-age=3600",
				"Access-Control-Expose-Headers": "Content-Range, Accept-Ranges, Content-Length",
			};

			if (response.headers["content-length"]) headers["Content-Length"] = response.headers["content-length"];
			if (response.headers["content-range"]) headers["Content-Range"] = response.headers["content-range"];

			res.writeHead(response.statusCode, headers);
			response.pipe(res);
		});

		request.on("error", (err) => {
			console.error("Stream request error:", err);
			if (!res.headersSent) res.status(500).json({ message: "Failed to stream audio" });
		});

		request.end();
	} catch (error) {
		console.error("Stream error:", error);
		next(error);
	}
};
