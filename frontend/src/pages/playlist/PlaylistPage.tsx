import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Heart, Pause, Play, Trash2, Edit, Music, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDuration } from "../album/AlbumPage";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PlaylistPage = () => {
	const { playlistId } = useParams();
	const navigate = useNavigate();
	const { playlists, deletePlaylist, toggleFavorite, favorites, updatePlaylist, isLoading } = useLibraryStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	const currentPlaylist = playlists.find((p) => p._id === playlistId);

	// State for Edit Dialog
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	if (!currentPlaylist) return null;

	const handlePlayPlaylist = () => {
		if (!currentPlaylist || currentPlaylist.songs.length === 0) return;

		const isCurrentPlaylistPlaying = currentPlaylist.songs.some((song) => song._id === currentSong?._id);
		if (isCurrentPlaylistPlaying) togglePlay();
		else {
			playAlbum(currentPlaylist.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentPlaylist) return;
		playAlbum(currentPlaylist.songs, index);
	};

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this playlist?")) {
			await deletePlaylist(currentPlaylist._id);
			navigate("/");
		}
	};

	const openEditDialog = () => {
		setEditTitle(currentPlaylist.title);
		setEditDescription(currentPlaylist.description || "");
		setImagePreview(currentPlaylist.imageUrl || null);
		setIsEditOpen(true);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", editTitle);
		formData.append("description", editDescription);
		if (imageFile) formData.append("imageFile", imageFile);

		await updatePlaylist(currentPlaylist._id, formData);
		setIsEditOpen(false);
	};

	return (
		<div className='h-full bg-zinc-900/50'>
			<ScrollArea className='h-full rounded-md'>
				<div className='relative min-h-full pb-20'>
					<div 
						className='absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-zinc-900/80 to-zinc-900 pointer-events-none' 
						aria-hidden='true'
					/>

					<div className='relative z-10'>
						<div className='flex p-6 gap-6 pb-8'>
							{currentPlaylist.imageUrl ? (
								<img
									src={currentPlaylist.imageUrl}
									alt={currentPlaylist.title}
									className='w-[240px] h-[240px] shadow-xl rounded object-cover'
								/>
							) : (
								<div className='w-[240px] h-[240px] shadow-xl rounded bg-zinc-800 flex items-center justify-center'>
									<Music className='size-20 text-zinc-700' />
								</div>
							)}

							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium'>Playlist</p>
								<h1 className='text-7xl font-bold my-4'>{currentPlaylist.title}</h1>
								<div className='flex items-center gap-2 text-sm text-zinc-100'>
									<span className='font-medium text-white'>Your Collection</span>
									<span>• {currentPlaylist.songs.length} songs</span>
									{currentPlaylist.description && (
										<span className='text-zinc-400 italic font-light'>• {currentPlaylist.description}</span>
									)}
								</div>
							</div>
						</div>

						<div className='px-6 pb-4 flex items-center gap-6'>
							<Button
								onClick={handlePlayPlaylist}
								size='icon'
								className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all'
							>
								{isPlaying && currentPlaylist.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-7 w-7 text-black' />
								) : (
									<Play className='h-7 w-7 text-black' />
								)}
							</Button>

							<div className='flex gap-2'>
								<Button
									variant='ghost'
									size='icon'
									onClick={openEditDialog}
									className='text-zinc-400 hover:text-white transition-colors'
									title='Edit Playlist'
								>
									<Edit className='size-6' />
								</Button>

								<Button
									variant='ghost'
									size='icon'
									onClick={handleDelete}
									className='text-zinc-400 hover:text-red-500 transition-colors'
									title='Delete Playlist'
								>
									<Trash2 className='size-6' />
								</Button>
							</div>
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
									{currentPlaylist.songs.length === 0 && (
										<div className='text-center py-10 text-zinc-500'>No songs in this playlist yet.</div>
									)}
									{currentPlaylist.songs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-green-500'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{!isCurrentSong && <Play className='h-4 w-4 hidden group-hover:block' />}
												</div>

												<div className='flex items-center gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-10' />
													<div>
														<div className={`font-medium text-white`}>{song.title}</div>
														<div>{song.artist}</div>
													</div>
												</div>
												<div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
												<div className='flex items-center gap-4'>
													<button
														onClick={(e) => {
															e.stopPropagation();
															toggleFavorite(song._id, "Song");
														}}
													>
														<Heart
															className={cn(
																"size-4",
																favorites.some((f) => f.targetId === song._id)
																	? "fill-green-500 text-green-500"
																	: "text-zinc-400"
															)}
														/>
													</button>
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

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className='bg-zinc-900 border-zinc-800 text-white'>
					<DialogHeader>
						<DialogTitle>Edit Playlist</DialogTitle>
						<DialogDescription className='text-zinc-400'>Update your playlist details and image.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleUpdate} className='space-y-4 py-4'>
						<div
							className='flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-4 cursor-pointer hover:border-emerald-500 transition-colors bg-zinc-800/50'
							onClick={() => fileInputRef.current?.click()}
						>
							<input type='file' ref={fileInputRef} hidden accept='image/*' onChange={handleImageChange} />
							{imagePreview ? (
								<img src={imagePreview} alt='Preview' className='w-full h-40 object-cover rounded-md' />
							) : (
								<div className='flex flex-col items-center text-zinc-500'>
									<Upload className='size-10 mb-2' />
									<span>Change cover image</span>
								</div>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='edit-title'>Playlist Name</Label>
							<Input
								id='edit-title'
								value={editTitle}
								onChange={(e) => setEditTitle(e.target.value)}
								className='bg-zinc-800 border-zinc-700'
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='edit-desc'>Description</Label>
							<Textarea
								id='edit-desc'
								value={editDescription}
								onChange={(e) => setEditDescription(e.target.value)}
								className='bg-zinc-800 border-zinc-700 h-20 resize-none'
							/>
						</div>
						<DialogFooter>
							<Button type='button' variant='ghost' onClick={() => setIsEditOpen(false)} className='text-zinc-400'>
								Cancel
							</Button>
							<Button type='submit' disabled={isLoading} className='bg-white text-black hover:bg-white/90'>
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default PlaylistPage;
