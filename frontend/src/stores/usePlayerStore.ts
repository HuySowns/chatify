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
	isShuffle: boolean;
	isRepeat: boolean;

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
	toggleShuffle: () => void;
	toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	currentPlaybackTime: 0,
	isShuffle: false,
	isRepeat: false,

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
		const { currentIndex, queue, isShuffle, isRepeat } = get();
		if (queue.length === 0) return;

		let nextIndex = currentIndex + 1;
		if (isShuffle) {
			nextIndex = Math.floor(Math.random() * queue.length);
		}

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
		} else if (isRepeat) {
			// loop back to the beginning if repeat is on
			const nextSong = queue[0];
			set({
				currentSong: nextSong,
				currentIndex: 0,
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
		const { currentIndex, queue, isShuffle } = get();
		if (queue.length === 0) return;

		let prevIndex = currentIndex - 1;
		if (isShuffle) {
			prevIndex = Math.floor(Math.random() * queue.length);
		}

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
				console.log("Saving playback position:", {
					songId: currentSong._id,
					songTitle: currentSong.title,
					playbackTime: currentPlaybackTime,
				});
				const result = await axiosInstance.post("/users/playback-position", {
					currentSongId: currentSong._id,
					currentPlaybackTime,
				});
				console.log("Playback position saved successfully:", result.data);
			} else {
				console.warn("Cannot save playback position - no current song");
			}
		} catch (error) {
			console.error("Error saving playback position:", error);
		}
	},

	loadPlaybackPosition: async () => {
		try {
			console.log("Loading playback position...");
			const response = await axiosInstance.get("/users/playback-position");
			const { currentSongId, currentPlaybackTime } = response.data;

			console.log("Loaded playback data:", {
				currentSongId,
				currentPlaybackTime,
			});

			if (currentSongId) {
				// Fetch the full song data
				try {
					console.log("Fetching song data for ID:", currentSongId);
					const songResponse = await axiosInstance.get(`/songs/by-id/${currentSongId}`);
					const song = songResponse.data;

					console.log("Song loaded successfully:", {
						songId: song._id,
						songTitle: song.title,
						duration: song.duration,
					});

					// Get current queue and try to find the song in it
					const currentQueue = get().queue;
					let index = 0;
					
					if (currentQueue.length > 0) {
						// Try to find the song in existing queue
						const foundIndex = currentQueue.findIndex(s => s._id === currentSongId);
						if (foundIndex >= 0) {
							index = foundIndex;
						}
					}

					set({
						currentSong: song,
						currentPlaybackTime: currentPlaybackTime || 0,
						isPlaying: false, // Prevent autoplay block when restoring
						currentIndex: index,
						// Only update queue if it's empty
						...(currentQueue.length === 0 && { queue: [song] }),
					});

					console.log("Playback position restored - song set in store at index", index);
				} catch (songError) {
					console.error(
						"Error fetching song:",
						songError instanceof Error ? songError.message : songError
					);
					// If song not found, just set the playback time
					set({
						currentPlaybackTime: currentPlaybackTime || 0,
					});
				}
			} else {
				console.log("No saved playback position found");
			}
		} catch (error) {
			console.error(
				"Error loading playback position:",
				error instanceof Error ? error.message : error
			);
		}
	},

	clearPlaybackPosition: async () => {
		try {
			await axiosInstance.post("/users/playback-position", {
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

	toggleShuffle: () => {
		set((state) => ({ isShuffle: !state.isShuffle }));
	},
	toggleRepeat: () => {
		set((state) => ({ isRepeat: !state.isRepeat }));
	},
}));
