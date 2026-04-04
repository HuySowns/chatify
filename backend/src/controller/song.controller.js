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

		const options = {
			hostname: url.hostname,
			path: url.pathname + url.search,
			method: "GET",
		};

		// Add range header if client sent one
		if (req.headers.range) {
			options.headers = {
				Range: req.headers.range,
			};
		}

		const request = https.request(options, (response) => {
			// Handle range request response
			const contentLength = response.headers["content-length"];
			const contentRange = response.headers["content-range"];

			let statusCode = response.statusCode;
			if (statusCode === 206 || statusCode === 200) {
				// 206 Partial Content for range requests, 200 OK for full content
				res.status(statusCode);
			} else if (statusCode !== 200) {
				return res.status(statusCode).json({ message: "Failed to fetch audio" });
			}

			res.set({
				"Content-Type": response.headers["content-type"] || "audio/mpeg",
				"Content-Disposition": "inline",
				"Cache-Control": "public, max-age=3600",
				"Accept-Ranges": "bytes",
			});

			// Forward relevant headers
			if (contentLength) {
				res.set("Content-Length", contentLength);
			}
			if (contentRange) {
				res.set("Content-Range", contentRange);
			}

			response.pipe(res);
		});

		request.on("error", (err) => {
			console.error("Stream request error:", err);
			res.status(500).json({ message: "Failed to stream audio" });
		});

		request.end();
	} catch (error) {
		console.error("Stream error:", error);
		next(error);
	}
};
