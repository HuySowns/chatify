import { axiosInstance, setupAxiosInterceptors } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { useSocialStore } from "@/stores/useSocialStore";
import { useExtraStore } from "@/stores/useExtraStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const { user } = useUser();
	const [loading, setLoading] = useState(true);
	
	const { checkAdminStatus, setIsPremium } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();
	const { loadPlaybackPosition } = usePlayerStore();
	const { fetchPlaylists, fetchFavorites } = useLibraryStore();
	const { fetchFollows } = useSocialStore();
	const { fetchNotifications, fetchGenres } = useExtraStore();

	// 1. Cấu hình Axios Interceptor (Bộ lọc tự động)
	// Task: Trước mỗi khi gửi request, Axios sẽ tự gọi getToken() của Clerk
	// Điều này đảm bảo Token gửi lên Backend luôn là mới nhất và không bị hết hạn (Unauthorized)
	useEffect(() => {
		setupAxiosInterceptors(getToken);
	}, [getToken]);

	// 2. Đồng bộ User vào Database và tải dữ liệu ban đầu
	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				if (token && user) {
					// Đồng bộ thông tin user từ Clerk sang MongoDB
					const response = await axiosInstance.post("/auth/callback", {
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						imageUrl: user.imageUrl,
					});

					// Cập nhật trạng thái Premium từ DB
					if (response.data.user) {
						setIsPremium(response.data.user.isPremium || false);
					}

					// Tải tất cả dữ liệu cần thiết cho app
					await Promise.all([
						checkAdminStatus(),
						fetchPlaylists(),
						fetchFavorites(),
						fetchFollows(),
						fetchNotifications(),
						fetchGenres(),
					]);


					// Tải vị trí nghe đã lưu khi user login
					try {
						await loadPlaybackPosition();
					} catch (playbackError) {
						console.warn("Could not load playback position:", playbackError);
					}
					// Khởi tạo socket connection
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				console.error("Error in initAuth:", error);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			initAuth();
		} else if (!userId) {
			setLoading(false);
		}

		return () => {
			disconnectSocket();
		};
	}, [
		getToken, 
		userId, 
		user, 
		checkAdminStatus, 
		initSocket, 
		disconnectSocket, 
		loadPlaybackPosition,
		fetchPlaylists,
		fetchFavorites,
		fetchFollows,
		fetchNotifications,
		fetchGenres
	]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;

