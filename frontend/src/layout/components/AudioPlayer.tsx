import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);
	const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { currentSong, isPlaying, playNext, setCurrentPlaybackTime, savePlaybackPosition } = usePlayerStore();

	// handle play/pause logic
	useEffect(() => {
		if (isPlaying) {
			audioRef.current?.play().catch((err) => console.error("Play failed:", err));
		} else {
			audioRef.current?.pause();
		}
	}, [isPlaying]);

	// handle song ends
	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			playNext();
		};

		audio?.addEventListener("ended", handleEnded);

		return () => audio?.removeEventListener("ended", handleEnded);
	}, [playNext]);

	// handle audio errors
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleError = (e: any) => {
			console.error("AudioPlayer: Audio error", {
				error: e,
				code: audio.error?.code,
				message: audio.error?.message,
				src: audio.src,
			});
		};

		const handleLoadStart = () => {
			console.log("AudioPlayer: Load start", { src: audio.src });
		};

		const handleCanPlay = () => {
			console.log("AudioPlayer: Can play", { duration: audio.duration, currentTime: audio.currentTime });
		};

		const handleLoadedMetadata = () => {
			console.log("AudioPlayer: Loaded metadata", {
				duration: audio.duration,
				currentTime: audio.currentTime,
				readyState: audio.readyState,
				networkState: audio.networkState,
			});
		};

		audio.addEventListener("error", handleError);
		audio.addEventListener("loadstart", handleLoadStart);
		audio.addEventListener("canplay", handleCanPlay);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);

		return () => {
			audio.removeEventListener("error", handleError);
			audio.removeEventListener("loadstart", handleLoadStart);
			audio.removeEventListener("canplay", handleCanPlay);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
		};
	}, []);

	// handle time update and save playback position
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => {
			setCurrentPlaybackTime(audio.currentTime);

			// Lưu vị trí nghe lên server mỗi 5 giây
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}

			saveTimeoutRef.current = setTimeout(() => {
				savePlaybackPosition();
			}, 5000);
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [setCurrentPlaybackTime, savePlaybackPosition]);

	// handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		// check if this is actually a new song
		const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";
		const streamUrl = `${backendUrl}/api/songs/stream/${currentSong._id}`;
		const isSongChange = prevSongRef.current !== streamUrl;

		if (isSongChange) {
			audio.src = streamUrl;
			audio.currentTime = 0;
			prevSongRef.current = streamUrl;

			if (isPlaying) {
				audio.play().catch((error) => {
					console.error("Failed to play audio:", error);
				});
			}
		}
	}, [currentSong, isPlaying]);

	// save playback position before page unload
	useEffect(() => {
		const handleBeforeUnload = () => {
			savePlaybackPosition();
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [savePlaybackPosition]);

	return <audio ref={audioRef} crossOrigin="anonymous" />;
};
export default AudioPlayer;
