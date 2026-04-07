import { useLibraryStore } from "@/stores/useLibraryStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { Heart, HomeIcon, Library, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading: musicLoading } = useMusicStore();
	const { playlists, favorites, fetchPlaylists, fetchFavorites, isLoading: libraryLoading } = useLibraryStore();

	useEffect(() => {
		fetchAlbums();
		fetchPlaylists();
		fetchFavorites();
	}, [fetchAlbums, fetchPlaylists, fetchFavorites]);

	const isLoading = musicLoading || libraryLoading;

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}
			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4 min-h-0 flex flex-col'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Your Library</span>
					</div>
					<SignedIn>
						<CreatePlaylistDialog />
					</SignedIn>
				</div>

				<ScrollArea className='flex-1'>
					<div className='space-y-2'>
						<SignedIn>
							{/* Liked Songs Entry */}
							<Link
								to='/favorites'
								className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
							>
								<div className='size-12 rounded-md bg-gradient-to-br from-indigo-700 to-indigo-300 flex items-center justify-center flex-shrink-0'>
									<Heart className='size-6 text-white' fill='white' />
								</div>
								<div className='flex-1 min-w-0 hidden md:block'>
									<p className='font-medium truncate'>Liked Songs</p>
									<p className='text-sm text-zinc-400 truncate'>
										Playlist • {favorites.length} songs
									</p>
								</div>
							</Link>
						</SignedIn>

						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							<>
								{/* Actual Playlists */}
								{playlists.map((playlist) => (
									<Link
										to={`/playlists/${playlist._id}`}
										key={playlist._id}
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										<div className='size-12 rounded-md bg-zinc-800 flex items-center justify-center flex-shrink-0'>
											<Library className='size-6 text-zinc-400' />
										</div>
										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium truncate'>{playlist.title}</p>
											<p className='text-sm text-zinc-400 truncate'>Playlist</p>
										</div>
									</Link>
								))}

								{/* Albums */}
								{albums.map((album) => (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										<img
											src={album.imageUrl}
											alt='Album img'
											className='size-12 rounded-md flex-shrink-0 object-cover'
										/>
										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium truncate'>{album.title}</p>
											<p className='text-sm text-zinc-400 truncate'>
												Album • {album.artist}
											</p>
										</div>
									</Link>
								))}
							</>
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default LeftSidebar;
