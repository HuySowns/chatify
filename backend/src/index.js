import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import userRoutes from "./controller/user.controller.js";
import adminRoutes from "./controller/admin.controller.js";
import authRoutes from "./controller/auth.controller.js";
import songRoutes from "./controller/song.controller.js";
import albumRoutes from "./controller/album.controller.js";
import statRoutes from "./controller/stat.controller.js";
import messageRoutes from "./controller/message.controller.js"; // Also need to add message!
import playlistRoutes from "./controller/playlist.controller.js";
import genreRoutes from "./controller/genre.controller.js";
import transactionRoutes from "./controller/transaction.controller.js";
import favoriteRoutes from "./controller/favorite.controller.js";
import commentRoutes from "./controller/comment.controller.js";
import notificationRoutes from "./controller/notification.controller.js";
import followRoutes from "./controller/follow.controller.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		// Cho phép Range header để audio element có thể seek (chình xác vị trí phát)
		allowedHeaders: ["Content-Type", "Authorization", "Range"],
		exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"],
	})
);

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB  max file size
		},
	})
);

// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/follows", followRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// error handler
app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

httpServer.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	connectDB();
});
