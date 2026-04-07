import { Router } from "express";
import { getPlaylists, createPlaylist, deletePlaylist, addSongToPlaylist, updatePlaylist } from "../routes/playlist.route.js";

const router = Router();

router.get("/", getPlaylists);
router.post("/", createPlaylist);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);
router.post("/:playlistId/songs", addSongToPlaylist);

export default router;


