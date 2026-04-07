import { axiosInstance } from "@/lib/axios";
import { Follow } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface FollowStore {
	following: Follow[];
	followers: Follow[]; // Who follows ME
	isLoading: boolean;
	error: string | null;

	fetchFollowStats: () => Promise<void>;
	toggleFollow: (followingId: string) => Promise<void>;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
	following: [],
	followers: [],
	isLoading: false,
	error: null,

	fetchFollowStats: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/follows");
			set({ 
				following: response.data.following,
				followers: response.data.followers 
			});
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	toggleFollow: async (followingId: string) => {
		try {
			const response = await axiosInstance.post("/follows/toggle", { followingId });
			const { following } = get();
			
			const isFollowing = response.data.isFollowing;

			if (!isFollowing) {
				// Xóa khỏi danh sách sau khi unfollow (Xử lý cả trường hợp ID là string hoặc đã được populate thành object)
				set({ 
					following: following.filter((f) => {
						const fid = typeof f.followingId === "string" ? f.followingId : (f.followingId as any)?._id;
						return fid !== followingId;
					}) 
				});
				toast.success("Unfollowed");
			} else {
				// Thêm vào danh sách sau khi follow
				set({ following: [...following, response.data] });
				toast.success("Following");
			}
			
			// Refresh stats to ensure counts are correct and objects are populated
			get().fetchFollowStats();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Action failed");
		}
	},
}));
