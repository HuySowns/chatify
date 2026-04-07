import { Router } from "express";
import { 
	getAllSongs, 
	getSongById, 
	getFeaturedSongs, 
	getMadeForYouSongs, 
	getTrendingSongs, 
	getSongsByGenre,
	streamSong 
} from "../routes/song.route.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Lấy danh sách tất cả bài hát (Cần protectRoute để user thường có thể lấy bài yêu thích)
router.get("/", protectRoute, getAllSongs);

// Lấy bài hát theo ID
router.get("/by-id/:id", protectRoute, getSongById);

// MỚI: Lấy danh sách bài hát theo Thể loại (Genre)
router.get("/genre/:genreId", getSongsByGenre);

// Các danh mục đặc biệt (Featured, Trending...)
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

// Stream audio
router.get("/stream/:id", streamSong);

export default router;
