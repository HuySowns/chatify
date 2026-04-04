import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";
import { axiosInstance } from "@/lib/axios";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	currentPlaybackTime: number;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	setCurrentPlaybackTime: (time: number) => void;
	savePlaybackPosition: () => Promise<void>;
	loadPlaybackPosition: () => Promise<void>;
	clearPlaybackPosition: () => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	currentPlaybackTime: 0,

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}
		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
			currentPlaybackTime: 0,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
			currentPlaybackTime: 0,
		});
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;

		const currentSong = get().currentSong;
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({
			isPlaying: willStartPlaying,
		});
	},

	playNext: () => {
		const { currentIndex, queue } = get();
		const nextIndex = currentIndex + 1;

		// if there is a next song to play, let's play it
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
				currentPlaybackTime: 0,
			});
		} else {
			// no next song
			set({ isPlaying: false });

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
		}
	},

	playPrevious: () => {
		const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;

		// theres a prev song
		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
				currentPlaybackTime: 0,
			});
		} else {
			// no prev song
			set({ isPlaying: false });

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
		}
	},

	setCurrentPlaybackTime: (time: number) => {
		set({
			currentPlaybackTime: time,
		});
	},

	savePlaybackPosition: async () => {
		try {
			const { currentSong, currentPlaybackTime } = get();
			if (currentSong) {
				await axiosInstance.post("/user/playback-position", {
					currentSongId: currentSong._id,
					currentPlaybackTime,
				});
			}
		} catch (error) {
			console.error("Error saving playback position:", error);
		}
	},

	loadPlaybackPosition: async () => {
		try {
			const response = await axiosInstance.get("/user/playback-position");
			const { currentSongId, currentPlaybackTime } = response.data;

			if (currentSongId) {
				// Fetch the full song data
				try {
					const songResponse = await axiosInstance.get(`/songs/by-id/${currentSongId}`);
					const song = songResponse.data;
					
					set({
						currentSong: song,
						currentPlaybackTime,
						isPlaying: true, // Automatically play the song when loading
					});
				} catch (songError) {
					console.error("Error fetching song:", songError);
					// If song not found, just set the playback time
					set({
						currentPlaybackTime,
					});
				}
			}
		} catch (error) {
			console.error("Error loading playback position:", error);
		}
	},

	clearPlaybackPosition: async () => {
		try {
			await axiosInstance.post("/user/playback-position", {
				currentSongId: null,
				currentPlaybackTime: 0,
			});
			set({
				currentPlaybackTime: 0,
			});
		} catch (error) {
			console.error("Error clearing playback position:", error);
		}
	},
}));
