import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) {
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		// Lưu token vào window để AudioPlayer dùng trong synchronous XHR (beforeunload)
		(window as any).__chatifyAuthToken = token;
	} else {
		delete axiosInstance.defaults.headers.common["Authorization"];
		(window as any).__chatifyAuthToken = null;
	}
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const { user } = useUser();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();
	const { loadPlaybackPosition } = usePlayerStore();

	// Initialize auth and load playback position
	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				console.log("Token from Clerk:", token ? "✓ Received" : "✗ No token");
				updateApiToken(token);
				if (token && user) {
					// sync user to db
					await axiosInstance.post("/auth/callback", {
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						imageUrl: user.imageUrl,
					});

					await checkAdminStatus();
					// Tải vị trí nghe đã lưu khi user login
					try {
						await loadPlaybackPosition();
					} catch (playbackError) {
						console.warn("Could not load playback position:", playbackError);
					}
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				console.error("Error in initAuth:", error);
				updateApiToken(null);
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
	}, [getToken, userId, user, checkAdminStatus, initSocket, disconnectSocket, loadPlaybackPosition]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
