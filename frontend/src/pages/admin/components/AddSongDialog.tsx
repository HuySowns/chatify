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
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { useExtraStore } from "@/stores/useExtraStore"; // Bổ sung
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
	title: string;
	artist: string;
	album: string;
	genre: string; // Bổ sung
	duration: string;
}

const AddSongDialog = () => {
	const { albums } = useMusicStore();
	const { genres } = useExtraStore(); // Lấy danh sách thể loại
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		artist: "",
		album: "",
		genre: "", // Bổ sung
		duration: "0",
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!files.audio || !files.image) {
				return toast.error("Please upload both audio and image files");
			}

			if (!newSong.title.trim() || !newSong.artist.trim()) {
				return toast.error("Title and artist are required");
			}

			const formData = new FormData();

			formData.append("title", newSong.title);
			formData.append("artist", newSong.artist);
			formData.append("duration", newSong.duration);
			
			if (newSong.album && newSong.album !== "none") {
				formData.append("albumId", newSong.album);
			}

			// Bổ sung gửi genreId lên backend
			if (newSong.genre && newSong.genre !== "none") {
				formData.append("genreId", newSong.genre);
			}

			formData.append("audioFile", files.audio);
			formData.append("imageFile", files.image);

			await axiosInstance.post("/admin/songs", formData);

			setNewSong({
				title: "",
				artist: "",
				album: "",
				genre: "",
				duration: "0",
			});

			setFiles({
				audio: null,
				image: null,
			});
			setSongDialogOpen(false);
			
			// Tải lại trang để cập nhật danh sách
			setTimeout(() => {
				window.location.reload();
			}, 500);
			toast.success("Song added successfully");
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || "Unknown error";
			console.error("Song upload error:", error);
			toast.error("Failed to add song: " + errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-emerald-500 hover:bg-emerald-600 text-black font-bold'>
					<Plus className='mr-2 h-4 w-4' />
					Add Song
				</Button>
			</DialogTrigger>

			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[85vh] overflow-auto custom-scrollbar text-white'>
				<DialogHeader>
					<DialogTitle>Add New Song</DialogTitle>
					<DialogDescription className='text-zinc-400'>Add a new song to your music library</DialogDescription>
				</DialogHeader>

				<div className='space-y-5 py-4'>
					<input
						type='file'
						accept='audio/*'
						ref={audioInputRef}
						hidden
						onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
					/>

					<input
						type='file'
						ref={imageInputRef}
						className='hidden'
						accept='image/*'
						onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
					/>

					{/* image upload area */}
					<div
						className='flex items-center justify-center p-8 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors bg-zinc-800/30'
						onClick={() => imageInputRef.current?.click()}
					>
						<div className='text-center'>
							{files.image ? (
								<div className='space-y-2'>
									<div className='text-sm text-emerald-500 font-medium'>Image selected:</div>
									<div className='text-xs text-zinc-400 truncate max-w-[200px]'>{files.image.name}</div>
								</div>
							) : (
								<>
									<div className='p-3 bg-zinc-800 rounded-full inline-block mb-3'>
										<Upload className='h-6 w-6 text-zinc-400' />
									</div>
									<div className='text-sm text-zinc-300 mb-2'>Upload artwork</div>
									<p className='text-xs text-zinc-500'>JPEG, PNG up to 10MB</p>
								</>
							)}
						</div>
					</div>

					{/* Audio upload */}
					<div className='space-y-2'>
						<label className='text-sm font-medium text-zinc-300'>Audio File</label>
						<Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700'>
							{files.audio ? (
								<span className='truncate'>{files.audio.name}</span>
							) : (
								"Choose Audio File"
							)}
						</Button>
					</div>

					{/* Fields Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium text-zinc-300'>Title</label>
							<Input
								value={newSong.title}
								onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
								className='bg-zinc-800 border-zinc-700'
								placeholder='Song title'
							/>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium text-zinc-300'>Artist</label>
							<Input
								value={newSong.artist}
								onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
								className='bg-zinc-800 border-zinc-700'
								placeholder='Artist name'
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium text-zinc-300'>Duration (seconds)</label>
						<Input
							type='number'
							min='0'
							value={newSong.duration}
							onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					{/* Album & Genre Selectors */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium text-zinc-300'>Album (Optional)</label>
							<Select
								value={newSong.album}
								onValueChange={(value) => setNewSong({ ...newSong, album: value })}
							>
								<SelectTrigger className='bg-zinc-800 border-zinc-700'>
									<SelectValue placeholder='Select album' />
								</SelectTrigger>
								<SelectContent className='bg-zinc-800 border-zinc-700 text-white'>
									<SelectItem value='none'>Single (No Album)</SelectItem>
									{albums.map((album) => (
										<SelectItem key={album._id} value={album._id}>
											{album.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium text-zinc-300'>Genre (Optional)</label>
							<Select
								value={newSong.genre}
								onValueChange={(value) => setNewSong({ ...newSong, genre: value })}
							>
								<SelectTrigger className='bg-zinc-800 border-zinc-700'>
									<SelectValue placeholder='Select genre' />
								</SelectTrigger>
								<SelectContent className='bg-zinc-800 border-zinc-700 text-white'>
									<SelectItem value='none'>No Genre</SelectItem>
									{genres.map((genre) => (
										<SelectItem key={genre._id} value={genre._id}>
											{genre.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<DialogFooter className='pt-4'>
					<Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading} className='border-zinc-700 text-zinc-400 hover:text-white'>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading} className='bg-emerald-500 hover:bg-emerald-600 text-black font-bold'>
						{isLoading ? "Uploading..." : "Add Song"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddSongDialog;
