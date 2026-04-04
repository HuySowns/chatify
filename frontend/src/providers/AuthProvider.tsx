import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();
	const { loadPlaybackPosition } = usePlayerStore();

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				console.log("Token from Clerk:", token ? "✓ Received" : "✗ No token");
				updateApiToken(token);
				if (token) {
					await checkAdminStatus();
					// Tải vị trí nghe đã lưu khi user login (không block nếu fail)
					try {
						await loadPlaybackPosition();
					} catch (playbackError) {
						console.warn("Could not load playback position:", playbackError);
					}
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				console.error("Error getting token from Clerk:", error);
				updateApiToken(null);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket, loadPlaybackPosition]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
