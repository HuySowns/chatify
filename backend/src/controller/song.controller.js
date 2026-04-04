import { Song } from "../models/song.model.js";
import https from "https";

export const getAllSongs = async (req, res, next) => {
	try {
		// -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
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
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 },
			},
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
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
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
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
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
		next(error);
	}
};

export const streamSong = async (req, res, next) => {
	try {
		const song = await Song.findById(req.params.id);
		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}

		const audioUrl = song.audioUrl;
		const url = new URL(audioUrl);
		const rangeHeader = req.headers.range;

		const requestHeaders = {
			// Forward range header để Cloudinary có thể trả về đúng đoạn audio
			...(rangeHeader && { Range: rangeHeader }),
		};

		const options = {
			hostname: url.hostname,
			path: url.pathname + url.search,
			method: "GET",
			headers: requestHeaders,
		};

		const request = https.request(options, (response) => {
			const upstreamStatus = response.statusCode;
			const contentLength = response.headers["content-length"];
			const contentRange = response.headers["content-range"];
			const contentType = response.headers["content-type"] || "audio/mpeg";

			// Nếu Cloudinary hỗ trợ range → trả về 206 Partial Content
			// Nếu không → trả về 200 (toàn bộ file)
			const responseStatus = upstreamStatus === 206 ? 206 : 200;

			if (upstreamStatus !== 200 && upstreamStatus !== 206) {
				return res.status(upstreamStatus).json({ message: "Failed to fetch audio" });
			}

			// Headers bắt buộc để browser audio element có thể seek
			const headers = {
				"Content-Type": contentType,
				"Content-Disposition": "inline",
				"Accept-Ranges": "bytes",
				// Cache để tránh re-download mỗi lần seek
				"Cache-Control": "public, max-age=3600",
				// Cho phép frontend JS đọc headers này (CORS)
				"Access-Control-Expose-Headers": "Content-Range, Accept-Ranges, Content-Length",
			};

			if (contentLength) headers["Content-Length"] = contentLength;
			if (contentRange) headers["Content-Range"] = contentRange;

			res.writeHead(responseStatus, headers);
			response.pipe(res);
		});

		request.on("error", (err) => {
			console.error("Stream request error:", err);
			if (!res.headersSent) {
				res.status(500).json({ message: "Failed to stream audio" });
			}
		});

		request.end();
	} catch (error) {
		console.error("Stream error:", error);
		next(error);
	}
};

