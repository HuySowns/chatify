import { axiosInstance } from "@/lib/axios";
import { Genre, Notification, Transaction } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface ExtraStore {
	notifications: Notification[];
	genres: Genre[];
	transactions: Transaction[];
	isLoading: boolean;
	error: string | null;

	fetchNotifications: () => Promise<void>;
	markNotificationAsRead: (id: string) => Promise<void>;
	clearNotifications: () => Promise<void>;
	
	fetchGenres: () => Promise<void>;
	
	fetchTransactions: () => Promise<void>;
	upgradeToPremium: () => Promise<void>;
}

export const useExtraStore = create<ExtraStore>((set) => ({
	notifications: [],
	genres: [],
	transactions: [],
	isLoading: false,
	error: null,

	fetchNotifications: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/notifications");
			set({ notifications: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	markNotificationAsRead: async (id) => {
		try {
			await axiosInstance.patch(`/notifications/${id}`, { isRead: true });
			set((state) => ({
				notifications: state.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
			}));
		} catch (error: any) {
			console.log(error);
		}
	},

	clearNotifications: async () => {
		try {
			await axiosInstance.delete("/notifications");
			set({ notifications: [] });
			toast.success("Notifications cleared");
		} catch (error: any) {
			toast.error("Failed to clear notifications");
		}
	},

	fetchGenres: async () => {
		try {
			const response = await axiosInstance.get("/genres");
			set({ genres: response.data });
		} catch (error: any) {
			console.log(error);
		}
	},

	fetchTransactions: async () => {
		try {
			const response = await axiosInstance.get("/transactions");
			set({ transactions: response.data });
		} catch (error: any) {
			console.log(error);
		}
	},

	upgradeToPremium: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.post("/transactions", {
				amount: 99000,
				description: "Premium Subscription Upgrade",
			});
			set((state) => ({ transactions: [...state.transactions, response.data] }));
			toast.success("Successfully upgraded to Premium!");
		} catch (error: any) {
			toast.error("Upgrade failed. Please try again.");
		} finally {
			set({ isLoading: false });
		}
	},
}));

(window as any).useExtraStore = useExtraStore;
