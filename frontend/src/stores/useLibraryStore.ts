import { axiosInstance } from "@/lib/axios";
import { Favorite, Playlist } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface LibraryStore {
	playlists: Playlist[];
	favorites: Favorite[];
	isLoading: boolean;
	error: string | null;

	fetchPlaylists: () => Promise<void>;
	createPlaylist: (formData: FormData) => Promise<void>;
	updatePlaylist: (id: string, formData: FormData) => Promise<void>;
	deletePlaylist: (id: string) => Promise<void>;
	addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
	
	fetchFavorites: () => Promise<void>;
	toggleFavorite: (targetId: string, targetType: "Song" | "Album") => Promise<void>;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
	playlists: [],
	favorites: [],
	isLoading: false,
	error: null,

	fetchPlaylists: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/playlists");
			set({ playlists: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	createPlaylist: async (formData: FormData) => {
		set({ isLoading: true, error: null });
		try {
			// Sử dụng FormData để gửi kèm file ảnh lên Server
			const response = await axiosInstance.post("/playlists", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			set((state) => ({ playlists: [...state.playlists, response.data] }));
			toast.success("Playlist created with image");
		} catch (error: any) {
			toast.error("Failed to create playlist");
		} finally {
			set({ isLoading: false });
		}
	},

	updatePlaylist: async (id: string, formData: FormData) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.put(`/playlists/${id}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			set((state) => ({
				playlists: state.playlists.map((p) => (p._id === id ? response.data : p)),
			}));
			toast.success("Playlist updated");
		} catch (error: any) {
			toast.error("Failed to update playlist");
		} finally {
			set({ isLoading: false });
		}
	},

	deletePlaylist: async (id) => {
		try {
			await axiosInstance.delete(`/playlists/${id}`);
			set((state) => ({
				playlists: state.playlists.filter((p) => p._id !== id),
			}));
			toast.success("Playlist deleted");
		} catch (error: any) {
			toast.error("Failed to delete playlist");
		}
	},

	addSongToPlaylist: async (playlistId, songId) => {
		try {
			// 1. Gọi API thêm bài hát
			const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
			
			// 2. Cập nhật lại state của playlists trong store để giao diện hiển thị ngay bài hát mới
			const { playlists } = get();
			const updatedPlaylists = playlists.map((p) => 
				p._id === playlistId ? response.data : p
			);
			
			set({ playlists: updatedPlaylists });
			toast.success("Song added to playlist");
		} catch (error: any) {
			toast.error("Failed to add song");
		}
	},

	fetchFavorites: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/favorites");
			set({ favorites: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	toggleFavorite: async (targetId, targetType) => {
		try {
			const response = await axiosInstance.post("/favorites", { targetId, targetType });
			const { favorites } = get();
			const exists = favorites.find((f) => f.targetId === targetId);

			if (exists) {
				set({ favorites: favorites.filter((f) => f.targetId !== targetId) });
			} else {
				set({ favorites: [...favorites, response.data] });
			}
		} catch (error: any) {
			toast.error("Action failed");
		}
	},
}));
