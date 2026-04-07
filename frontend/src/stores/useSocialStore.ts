import { axiosInstance } from "@/lib/axios";
import { Comment, Follow } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface SocialStore {
	comments: Comment[];
	follows: Follow[];
	isLoading: boolean;
	error: string | null;

	fetchComments: (targetId: string, targetType: "Song" | "Album") => Promise<void>;
	postComment: (data: { songId?: string; albumId?: string; content: string }) => Promise<void>;
	updateComment: (id: string, content: string) => Promise<void>; // MỚI
	deleteComment: (id: string) => Promise<void>;
	
	fetchFollows: () => Promise<void>;
	toggleFollow: (followingId: string) => Promise<void>;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
	comments: [],
	follows: [],
	isLoading: false,
	error: null,

	fetchComments: async (targetId, targetType) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/comments?targetId=${targetId}&targetType=${targetType}`);
			set({ comments: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	postComment: async (data) => {
		try {
			const response = await axiosInstance.post("/comments", data);
			set((state) => ({ comments: [response.data, ...state.comments] }));
			toast.success("Comment posted");
		} catch (error: any) {
			toast.error("Failed to post comment");
		}
	},

	// MỚI: Cập nhật bình luận hiện có
	updateComment: async (id, content) => {
		try {
			const response = await axiosInstance.put(`/comments/${id}`, { content });
			const { comments } = get();
			set({
				comments: comments.map((c) => (c._id === id ? response.data : c)),
			});
			toast.success("Comment updated");
		} catch (error: any) {
			toast.error("Failed to update comment");
		}
	},

	deleteComment: async (id) => {
		try {
			await axiosInstance.delete(`/comments/${id}`);
			set((state) => ({
				comments: state.comments.filter((c) => c._id !== id),
			}));
			toast.success("Comment deleted");
		} catch (error: any) {
			toast.error("Failed to delete comment");
		}
	},

	fetchFollows: async () => {
		try {
			const response = await axiosInstance.get("/follows");
			set({ follows: response.data });
		} catch (error: any) {
			console.log(error);
		}
	},

	toggleFollow: async (followingId) => {
		try {
			const response = await axiosInstance.post("/follows", { followingId });
			const { follows } = get();
			const exists = follows.find((f) => f.followingId === followingId);

			if (exists) {
				set({ follows: follows.filter((f) => f.followingId !== followingId) });
				toast.success("Unfollowed user");
			} else {
				set({ follows: [...follows, response.data] });
				toast.success("Followed user");
			}
		} catch (error: any) {
			toast.error("Action failed");
		}
	},
}));
