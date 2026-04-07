import { Playlist } from "../models/playlist.model.js";

export const getPlaylists = async (req, res, next) => {
    try {
        const playlists = await Playlist.find().populate("songs");
        res.json(playlists);
    } catch (error) {
        next(error);
    }
};

export const createPlaylist = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        // mock userId if not present since we might not have clerk fully set up for test
        const userId = req.auth?.userId || req.body.userId; 
        const playlist = await Playlist.create({ title, description, userId });
        res.status(201).json(playlist);
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
