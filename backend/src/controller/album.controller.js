import { Router } from "express";
import { getAlbumById, getAllAlbums } from "../routes/album.route.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;
