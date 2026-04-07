import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Heart, Pause, Play } from "lucide-react";
import { formatDuration } from "../album/AlbumPage";
import { useMusicStore } from "@/stores/useMusicStore";
import LikeButton from "@/components/LikeButton";
import { cn } from "@/lib/utils";

import { useEffect } from "react";

const FavoritesPage = () => {
	const { favorites, fetchFavorites } = useLibraryStore();
	const { songs, fetchSongs } = useMusicStore(); 
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		fetchFavorites();
		fetchSongs();
	}, [fetchFavorites, fetchSongs]);


	// Lọc danh sách bài hát yêu thích (Dùng helper .toString() để so sánh chuẩn ID tránh lỗi String vs Object)
	const favoriteSongs = songs.filter((s) => 
		favorites.some((f) => {
			const fid = typeof f.targetId === "string" 
				? f.targetId 
				: (f.targetId as any)?._id?.toString() || f.targetId?.toString();
			return fid === s._id?.toString();
		})
	);

	const handlePlayFavorites = () => {
		if (favoriteSongs.length === 0) return;

		const isCurrentPlaying = favoriteSongs.some((song) => song._id === currentSong?._id);
		if (isCurrentPlaying) togglePlay();
		else {
			playAlbum(favoriteSongs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		playAlbum(favoriteSongs, index);
	};

	return (
		<div className='h-full bg-zinc-900/50'>
			<ScrollArea className='h-full rounded-md'>
				<div className='relative min-h-full pb-20'>
					<div className='absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-zinc-900/80 to-zinc-900 pointer-events-none' />

					<div className='relative z-10'>
						<div className='flex p-6 gap-6 pb-8'>
							<div className='w-[240px] h-[240px] shadow-xl rounded bg-gradient-to-br from-indigo-700 to-indigo-300 flex items-center justify-center shadow-black/50'>
								<Heart className='size-20 text-white' fill='white' />
							</div>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium text-white'>Playlist</p>
								<h1 className='text-7xl font-bold my-4 text-white'>Liked Songs</h1>
								<p className='text-sm text-zinc-100 font-medium opacity-80'>{favoriteSongs.length} songs</p>
							</div>
						</div>

						<div className='px-6 pb-4 flex items-center gap-6'>
							<Button
								onClick={handlePlayFavorites}
								size='icon'
								className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all text-black'
							>
								{isPlaying && favoriteSongs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-7 w-7' />
								) : (
									<Play className='h-7 w-7' />
								)}
							</Button>
						</div>

						<div className='bg-black/20 backdrop-blur-sm'>
							<div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
								<div>#</div>
								<div>Title</div>
								<div>Released Date</div>
								<div>
									<Clock className='h-4 w-4' />
								</div>
							</div>

							<div className='px-6'>
								<div className='space-y-2 py-4'>
									{favoriteSongs.length === 0 && (
										<div className='text-center py-20 text-zinc-500'>
											<Heart className='size-12 mx-auto mb-4 opacity-20' />
											<p className='text-lg font-medium'>Songs you like will appear here.</p>
											<p className='text-sm'>Save songs to your favorites to see them here.</p>
										</div>
									)}
									{favoriteSongs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className={cn(
													"grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer",
													isCurrentSong && "bg-white/5"
												)}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-green-500'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{(!isCurrentSong || !isPlaying) && (
														<Play className='h-4 w-4 hidden group-hover:block text-white' />
													)}
												</div>

												<div className='flex items-center gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-10 rounded' />
													<div>
														<div className={cn("font-medium", isCurrentSong ? "text-green-500" : "text-white")}>{song.title}</div>
														<div className='text-zinc-400 font-light'>{song.artist}</div>
													</div>
												</div>
												<div className='flex items-center'>{song.createdAt?.split("T")[0]}</div>
												<div className='flex items-center gap-4'>
													<LikeButton targetId={song._id} targetType='Song' />
													<span>{formatDuration(song.duration)}</span>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default FavoritesPage;
