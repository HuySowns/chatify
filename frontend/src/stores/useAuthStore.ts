import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
	isAdmin: boolean;
	isPremium: boolean; // Bổ sung trạng thái Premium
	isLoading: boolean;
	error: string | null;

	checkAdminStatus: () => Promise<void>;
	setIsPremium: (status: boolean) => void;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isPremium: false,
	isLoading: false,
	error: null,


	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/check");
			set({ isAdmin: response.data.admin });
		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	setIsPremium: (status: boolean) => {
		set({ isPremium: status });
	},

	reset: () => {
		set({ isAdmin: false, isPremium: false, isLoading: false, error: null });
	},
}));

