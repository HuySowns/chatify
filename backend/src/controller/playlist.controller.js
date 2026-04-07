import { Router } from "express";
import { getPlaylists, createPlaylist, deletePlaylist } from "../routes/playlist.route.js";

const router = Router();

router.get("/", getPlaylists);
router.post("/", createPlaylist);
router.delete("/:id", deletePlaylist);

export default router;
