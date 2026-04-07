import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongIdRef = useRef<string | null>(null);
	const saveThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { currentSong, isPlaying, playNext, setCurrentPlaybackTime, currentPlaybackTime } =
		usePlayerStore();

	// ---------- Play / Pause ----------
	useEffect(() => {
		if (!audioRef.current) return;
		const audio = audioRef.current;

		if (isPlaying) {
			// Lấy vị trí MỚI NHẤT từ store (tránh stale closure)
			const targetTime = usePlayerStore.getState().currentPlaybackTime;

			// Nếu audio đang ở vị trí sai (ví dụ: 0 khi store ghi nhận 0:05 sau restore),
			// seek đến đúng vị trí TRƯỚC KHI play. Threshold 1s để tránh seek không cần thiết.
			if (targetTime > 1 && Math.abs(audio.currentTime - targetTime) > 1) {
				console.log("[AudioPlayer] Syncing position before play:", audio.currentTime, "→", targetTime);
				audio.currentTime = targetTime;
			}

			audio.play().catch((err) => {
				console.error("Play failed:", err);
				usePlayerStore.setState({ isPlaying: false });
			});
		} else {
			audio.pause();
		}
	}, [isPlaying]);

	// ---------- Song ended → play next ----------
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const handleEnded = () => playNext();
		audio.addEventListener("ended", handleEnded);
		return () => audio.removeEventListener("ended", handleEnded);
	}, [playNext]);

	// ---------- Time update → sync store + throttled save ----------
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => {
			setCurrentPlaybackTime(audio.currentTime);

			if (saveThrottleRef.current) clearTimeout(saveThrottleRef.current);
			saveThrottleRef.current = setTimeout(() => {
				usePlayerStore.getState().savePlaybackPosition();
			}, 5000);
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			if (saveThrottleRef.current) clearTimeout(saveThrottleRef.current);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ---------- Save khi pause ----------
	useEffect(() => {
		if (!isPlaying) {
			usePlayerStore.getState().savePlaybackPosition();
		}
	}, [isPlaying]);

	// ---------- Song change → load, seek, and conditionally play ----------
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;
		const audio = audioRef.current;

		if (prevSongIdRef.current === currentSong._id) return;
		prevSongIdRef.current = currentSong._id;

		// Snapshot thời gian cần restore (> 1 = đang restore từ server)
		const savedTime = currentPlaybackTime;
		const isLocalPath = currentSong.audioUrl.startsWith("/");
		const streamUrl = isLocalPath ? currentSong.audioUrl : `${backendUrl}/api/songs/stream/${currentSong._id}`;

		audio.src = streamUrl;
		audio.load();

		// Cập nhật store ngay để PlaybackControls hiển thị đúng vị trí
		// (ngay cả trước khi canplay fire)
		if (savedTime > 0) {
			usePlayerStore.setState({ currentPlaybackTime: savedTime });
		}

		const handleCanPlay = () => {
			audio.removeEventListener("canplay", handleCanPlay);
			clearTimeout(fallbackTimer);

			// Pre-seek audio đến vị trí đã lưu để sẵn sàng khi user bấm Play
			if (savedTime > 1 && audio.currentTime < 1) {
				audio.currentTime = savedTime;
			}

			// Nếu đang trong chế độ tự động phát (next/prev/playAlbum) → play ngay
			const { isPlaying: shouldPlay } = usePlayerStore.getState();
			if (shouldPlay) {
				// Đọc lại targetTime mới nhất từ store để đảm bảo phát đúng vị trí
				const targetTime = usePlayerStore.getState().currentPlaybackTime;
				if (targetTime > 1 && Math.abs(audio.currentTime - targetTime) > 1) {
					audio.currentTime = targetTime;
				}
				audio.play().catch((err) => {
					console.error("Auto-play after song change failed:", err);
					usePlayerStore.setState({ isPlaying: false });
				});
			}
		};

		// Fallback nếu canplay không fire (mạng rất chậm)
		const fallbackTimer = setTimeout(() => {
			audio.removeEventListener("canplay", handleCanPlay);
			if (savedTime > 1 && audio.readyState >= 1 && audio.currentTime < 1) {
				audio.currentTime = savedTime;
			}
			const { isPlaying: shouldPlay } = usePlayerStore.getState();
			if (shouldPlay) {
				audio.play().catch((err) => {
					console.error("Fallback auto-play failed:", err);
					usePlayerStore.setState({ isPlaying: false });
				});
			}
		}, 3000);

		audio.addEventListener("canplay", handleCanPlay);

		return () => {
			audio.removeEventListener("canplay", handleCanPlay);
			clearTimeout(fallbackTimer);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSong]);

	// ---------- Lưu vị trí khi reload/đóng tab (synchronous XHR) ----------
	useEffect(() => {
		const handleBeforeUnload = () => {
			const state = usePlayerStore.getState();
			const audio = audioRef.current;
			if (!state.currentSong || !audio || audio.currentTime <= 0) return;

			const url = `${backendUrl}/api/users/playback-position`;
			const payload = JSON.stringify({
				currentSongId: state.currentSong._id,
				currentPlaybackTime: audio.currentTime,
			});

			try {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", url, false); // synchronous
				xhr.setRequestHeader("Content-Type", "application/json");
				const token = (window as any).__chatifyAuthToken;
				if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
				xhr.send(payload);
			} catch (err) {
				console.warn("beforeunload save failed:", err);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, []);

	return <audio ref={audioRef} crossOrigin="anonymous" />;
};

export default AudioPlayer;
