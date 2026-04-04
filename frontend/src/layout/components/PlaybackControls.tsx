import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
	if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	// currentPlaybackTime từ store là nguồn sự thật duy nhất cho vị trí phát
	// Nó được cập nhật bởi:
	//   1. AudioPlayer.setCurrentPlaybackTime() qua timeupdate event (khi đang phát)
	//   2. AudioPlayer khi restore vị trí sau reload (canplay handler)
	//   3. handleSeek khi user kéo thanh
	const {
		currentSong,
		isPlaying,
		togglePlay,
		playNext,
		playPrevious,
		isShuffle,
		toggleShuffle,
		currentPlaybackTime,
	} = usePlayerStore();

	const [volume, setVolume] = useState(75);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const displayDuration = duration > 0 ? duration : (currentSong?.duration || 0);

	// Lắng nghe sự kiện từ audio element để lấy duration
	useEffect(() => {
		audioRef.current = document.querySelector("audio");
		const audio = audioRef.current;
		if (!audio) return;

		const updateDuration = () => {
			if (audio.duration && isFinite(audio.duration)) {
				setDuration(audio.duration);
			}
		};

		const handleError = () => {
			console.error("PlaybackControls: Audio error", {
				code: audio.error?.code,
				message: audio.error?.message,
			});
		};

		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("durationchange", updateDuration);
		audio.addEventListener("error", handleError);

		// Nếu audio đã có duration (ví dụ sau khi restore)
		if (audio.duration && isFinite(audio.duration)) {
			setDuration(audio.duration);
		}

		return () => {
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("durationchange", updateDuration);
			audio.removeEventListener("error", handleError);
		};
	}, [currentSong]);

	// Khi user kéo thanh seek
	const handleSeek = (value: number[]) => {
		if (audioRef.current && displayDuration > 0) {
			const newTime = value[0];
			audioRef.current.currentTime = newTime;
			// Cập nhật store ngay lập tức để UI phản hồi tức thì
			usePlayerStore.setState({ currentPlaybackTime: newTime });
		}
	};

	return (
		<footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
			<div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
				{/* currently playing song */}
				<div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className='w-14 h-14 object-cover rounded-md'
							/>
							<div className='flex-1 min-w-0'>
								<div className='font-medium truncate hover:underline cursor-pointer'>
									{currentSong.title}
								</div>
								<div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>

				{/* player controls*/}
				<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
					<div className='flex items-center gap-4 sm:gap-6'>
						<Button
							size='icon'
							variant='ghost'
							className={`hidden sm:inline-flex hover:text-white ${isShuffle ? "text-emerald-500" : "text-zinc-400"}`}
							onClick={toggleShuffle}
						>
							<Shuffle className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8'
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hidden sm:inline-flex hover:text-white text-zinc-400'
						>
							<Repeat className='h-4 w-4' />
						</Button>
					</div>

					{/* Progress bar - dùng currentPlaybackTime từ store, cập nhật ngay kể cả khi pause */}
					<div className='hidden sm:flex items-center gap-2 w-full'>
						<div className='text-xs text-zinc-400 w-10 text-right'>
							{formatTime(currentPlaybackTime)}
						</div>
						<Slider
							value={[currentPlaybackTime]}
							max={Math.max(displayDuration, currentPlaybackTime, 1)}
							step={0.5}
							className='w-full hover:cursor-grab active:cursor-grabbing'
							onValueChange={handleSeek}
							disabled={displayDuration === 0 || !isFinite(displayDuration)}
						/>
						<div className='text-xs text-zinc-400 w-10'>
							{isFinite(displayDuration) && displayDuration > 0
								? formatTime(displayDuration)
								: "0:00"}
						</div>
					</div>
				</div>

				{/* volume controls */}
				<div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
					<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
						<Mic2 className='h-4 w-4' />
					</Button>
					<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
						<ListMusic className='h-4 w-4' />
					</Button>
					<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
						<Laptop2 className='h-4 w-4' />
					</Button>

					<div className='flex items-center gap-2'>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
							<Volume1 className='h-4 w-4' />
						</Button>

						<Slider
							value={[volume]}
							max={100}
							step={1}
							className='w-24 hover:cursor-grab active:cursor-grabbing'
							onValueChange={(value) => {
								setVolume(value[0]);
								if (audioRef.current) {
									audioRef.current.volume = value[0] / 100;
								}
							}}
						/>
					</div>
				</div>
			</div>
		</footer>
	);
};
