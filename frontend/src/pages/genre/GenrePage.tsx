import { useExtraStore } from "@/stores/useExtraStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, Music } from "lucide-react";
import { formatDuration } from "../album/AlbumPage";
import { cn } from "@/lib/utils";
import LikeButton from "@/components/LikeButton";

const GenrePage = () => {
	const { genreId } = useParams();
	const { genres, genreSongs, fetchSongsByGenre, isLoading } = useExtraStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	const genre = genres.find((g) => g._id === genreId);

	useEffect(() => {
		if (genreId) {
			fetchSongsByGenre(genreId);
		}
	}, [genreId, fetchSongsByGenre]);

	const handlePlayGenre = () => {
		if (genreSongs.length === 0) return;
		const isCurrentPlaying = genreSongs.some((song) => song._id === currentSong?._id);
		if (isCurrentPlaying) togglePlay();
		else playAlbum(genreSongs, 0);
	};

	const handlePlaySong = (index: number) => {
		playAlbum(genreSongs, index);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-full'>
				<div className='size-8 border-t-2 border-emerald-500 rounded-full animate-spin' />
			</div>
		);
	}

	if (!genre) return <div className='p-6 text-zinc-400'>Genre not found</div>;

	return (
		<div className='h-full bg-zinc-900/50'>
			<ScrollArea className='h-full rounded-md'>
				<div className='relative min-h-full pb-20'>
					{/* Gradient Background */}
					<div className='absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-zinc-900/80 to-zinc-900 pointer-events-none' />

					<div className='relative z-10'>
						{/* Header */}
						<div className='flex p-6 gap-6 pb-8'>
							{genre.imageUrl ? (
								<img src={genre.imageUrl} alt={genre.name} className='w-[240px] h-[240px] shadow-xl rounded-md object-cover' />
							) : (
								<div className='w-[240px] h-[240px] shadow-xl rounded-md bg-zinc-800 flex items-center justify-center'>
									<Music className='size-20 text-zinc-700' />
								</div>
							)}
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium text-zinc-300'>Genre</p>
								<h1 className='text-7xl font-bold my-4 text-white'>{genre.name}</h1>
								<p className='text-sm text-zinc-400 max-w-xl'>{genre.description}</p>
								<p className='text-sm text-zinc-300 mt-2 font-medium'>{genreSongs.length} songs</p>
							</div>
						</div>

						{/* Play Button */}
						<div className='px-6 pb-4 flex items-center gap-6'>
							<Button
								onClick={handlePlayGenre}
								size='icon'
								className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all text-black shadow-lg'
							>
								{isPlaying && genreSongs.some((s) => s._id === currentSong?._id) ? (
									<Pause className='h-7 w-7 fill-current' />
								) : (
									<Play className='h-7 w-7 fill-current' />
								)}
							</Button>
						</div>

						{/* Songs Table */}
						<div className='bg-black/20 backdrop-blur-sm'>
							<div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
								<div>#</div>
								<div>Title</div>
								<div>Artist</div>
								<div>
									<Clock className='h-4 w-4' />
								</div>
							</div>

							<div className='px-6'>
								<div className='space-y-1 py-4'>
									{genreSongs.length === 0 && (
										<div className='text-center py-20 text-zinc-500'>
											<Music className='size-12 mx-auto mb-4 opacity-20' />
											<p className='text-lg font-medium'>No songs in this genre yet.</p>
										</div>
									)}
									
									{genreSongs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className={cn(
													"grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer transition-colors",
													isCurrentSong && "bg-white/5"
												)}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-green-500 animate-pulse'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													<Play className='h-4 w-4 hidden group-hover:block text-white' />
												</div>

												<div className='flex items-center gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-10 rounded shrink-0 object-cover' />
													<div className={cn("font-medium truncate", isCurrentSong ? "text-green-500" : "text-white")}>
														{song.title}
													</div>
												</div>
												<div className='flex items-center truncate text-zinc-300'>{song.artist}</div>
												<div className='flex items-center gap-4'>
													<LikeButton targetId={song._id} targetType='Song' />
													<span className='text-xs'>{formatDuration(song.duration)}</span>
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

export default GenrePage;
