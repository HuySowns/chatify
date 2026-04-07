import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Song } from "@/types";
import { useMusicStore } from "@/stores/useMusicStore";
import { useExtraStore } from "@/stores/useExtraStore";
import { Edit2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface UpdateSongDialogProps {
	song: Song;
}

const UpdateSongDialog = ({ song }: UpdateSongDialogProps) => {
	const { albums, updateSong, isLoading: isUpdating } = useMusicStore();
	const { genres } = useExtraStore();
	const [isOpen, setIsOpen] = useState(false);

	const [formData, setFormData] = useState({
		title: song.title,
		artist: song.artist,
		albumId: song.albumId?.toString() || "none",
		genreId: (song as any).genreId?.toString() || "none",
		duration: song.duration.toString(),
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async () => {
		try {
			if (!formData.title.trim() || !formData.artist.trim()) {
				return toast.error("Title and artist are required");
			}

			const data = new FormData();
			data.append("title", formData.title);
			data.append("artist", formData.artist);
			data.append("albumId", formData.albumId);
			data.append("genreId", formData.genreId);
			data.append("duration", formData.duration);

			if (files.audio) data.append("audioFile", files.audio);
			if (files.image) data.append("imageFile", files.image);

			await updateSong(song._id, data);
			setIsOpen(false);
			
			// Tải lại để đồng bộ dữ liệu mới nhất
			setTimeout(() => {
				window.location.reload();
			}, 500);
		} catch (error: any) {
			toast.error("Failed to update song");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='ghost' size='sm' className='text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10'>
					<Edit2 className='size-4' />
				</Button>
			</DialogTrigger>

			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[85vh] overflow-auto custom-scrollbar text-white'>
				<DialogHeader>
					<DialogTitle>Update Song</DialogTitle>
					<DialogDescription className='text-zinc-400'>Modify song details and files</DialogDescription>
				</DialogHeader>

				<div className='space-y-5 py-4'>
					{/* Audio & Image Selection (Optional for Update) */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-xs font-medium text-zinc-400'>Replace Audio (Optional)</label>
							<Button 
								variant='outline' 
								size='sm' 
								onClick={() => audioInputRef.current?.click()} 
								className='w-full bg-zinc-800 border-zinc-700 truncate'
							>
								{files.audio ? files.audio.name : "Choose New Audio"}
							</Button>
							<input type='file' accept='audio/*' ref={audioInputRef} hidden onChange={(e) => setFiles({ ...files, audio: e.target.files![0] })} />
						</div>
						<div className='space-y-2'>
							<label className='text-xs font-medium text-zinc-400'>Replace Artwork (Optional)</label>
							<Button 
								variant='outline' 
								size='sm' 
								onClick={() => imageInputRef.current?.click()}
								className='w-full bg-zinc-800 border-zinc-700 truncate'
							>
								{files.image ? files.image.name : "Choose New Image"}
							</Button>
							<input type='file' accept='image/*' ref={imageInputRef} hidden onChange={(e) => setFiles({ ...files, image: e.target.files![0] })} />
						</div>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Title</label>
						<Input
							value={formData.title}
							onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Artist</label>
						<Input
							value={formData.artist}
							onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Duration (seconds)</label>
						<Input
							type='number'
							value={formData.duration}
							onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>Album</label>
							<Select value={formData.albumId} onValueChange={(value) => setFormData({ ...formData, albumId: value })}>
								<SelectTrigger className='bg-zinc-800 border-zinc-700'>
									<SelectValue placeholder='Select album' />
								</SelectTrigger>
								<SelectContent className='bg-zinc-800 border-zinc-700 text-white'>
									<SelectItem value='none'>No Album</SelectItem>
									{albums.map((album) => (
										<SelectItem key={album._id} value={album._id}>{album.title}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium'>Genre</label>
							<Select value={formData.genreId} onValueChange={(value) => setFormData({ ...formData, genreId: value })}>
								<SelectTrigger className='bg-zinc-800 border-zinc-700'>
									<SelectValue placeholder='Select genre' />
								</SelectTrigger>
								<SelectContent className='bg-zinc-800 border-zinc-700 text-white'>
									<SelectItem value='none'>No Genre</SelectItem>
									{genres.map((genre) => (
										<SelectItem key={genre._id} value={genre._id}>{genre.name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={() => setIsOpen(false)} disabled={isUpdating} className='border-zinc-700'>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isUpdating} className='bg-emerald-500 hover:bg-emerald-400 text-black font-bold'>
						{isUpdating ? "Updating..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateSongDialog;
