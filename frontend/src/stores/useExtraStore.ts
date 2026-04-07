import { axiosInstance } from "@/lib/axios";
import { Genre, Notification, Transaction } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

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
	fetchAllTransactions: () => Promise<void>;
	upgradeToPremium: () => Promise<void>;
	deleteTransaction: (id: string) => Promise<void>;
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

	fetchAllTransactions: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/transactions/all");
			set({ transactions: response.data });
		} catch (error: any) {
			toast.error("Failed to fetch all transactions");
		} finally {
			set({ isLoading: false });
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
			
			// Cập nhật trạng thái Premium ngay lập tức ở AuthStore
			useAuthStore.getState().setIsPremium(true);
			
			toast.success("Successfully upgraded to Premium!");
		} catch (error: any) {
			toast.error("Upgrade failed. Please try again.");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteTransaction: async (id) => {
		set({ isLoading: true });
		try {
			await axiosInstance.delete(`/transactions/${id}`);
			set((state) => ({
				transactions: state.transactions.filter((t) => t._id !== id),
			}));
			toast.success("Transaction deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete transaction");
		} finally {
			set({ isLoading: false });
		}
	},
}));

(window as any).useExtraStore = useExtraStore;
