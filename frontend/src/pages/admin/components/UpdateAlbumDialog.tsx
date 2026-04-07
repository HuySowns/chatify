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
import { useMusicStore } from "@/stores/useMusicStore";
import { Edit2, Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Album } from "@/types";
import { Label } from "@/components/ui/label";

interface UpdateAlbumDialogProps {
	album: Album;
	onSuccess?: () => void;
}

const UpdateAlbumDialog = ({ album, onSuccess }: UpdateAlbumDialogProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { updateAlbum } = useMusicStore();

	const [updatedAlbum, setUpdatedAlbum] = useState({
		title: album.title,
		artist: album.artist,
		releaseYear: album.releaseYear,
	});

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string>(album.imageUrl);

	// Reset state when dialog opens (Fix lỗi giữ dữ liệu cũ)
	useEffect(() => {
		if (dialogOpen) {
			setUpdatedAlbum({
				title: album.title,
				artist: album.artist,
				releaseYear: album.releaseYear,
			});
			setImageFile(null);
			setPreviewImage(album.imageUrl);
		}
	}, [dialogOpen, album]);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("title", updatedAlbum.title);
			formData.append("artist", updatedAlbum.artist);
			formData.append("releaseYear", updatedAlbum.releaseYear.toString());

			if (imageFile) {
				formData.append("imageFile", imageFile);
			}

			await updateAlbum(album._id, formData);
			setDialogOpen(false);
			onSuccess?.();
		} catch (error: any) {
			toast.error("Failed to update album: " + (error.response?.data?.message || error.message));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
				>
					<Edit2 className='h-4 w-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-800 sm:max-w-[450px] text-white'>
				<DialogHeader>
					<DialogTitle className='text-xl underline underline-offset-4 decoration-blue-500'>Update Album</DialogTitle>
					<DialogDescription className='text-zinc-400 font-light italic'>Update album details and artwork</DialogDescription>
				</DialogHeader>
				
				<form onSubmit={handleSubmit} className='space-y-6 pt-4'>
					{/* Image Selection Section */}
					<div className='flex flex-col items-center gap-4'>
						<div className='relative group'>
							<img
								src={previewImage}
								alt='Preview'
								className='w-32 h-32 rounded-lg object-cover border-2 border-zinc-700 group-hover:border-blue-500 transition-all shadow-lg'
							/>
							<div 
								className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg cursor-pointer transition-all'
								onClick={() => fileInputRef.current?.click()}
							>
								<Upload className='size-8 text-white' />
							</div>
							{imageFile && (
								<button 
									type='button' 
									onClick={() => { setImageFile(null); setPreviewImage(album.imageUrl); }}
									className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 border-2 border-zinc-900'
								>
									<X className='size-3 text-white' />
								</button>
							)}
						</div>
						<input
							type='file'
							ref={fileInputRef}
							onChange={handleImageSelect}
							accept='image/*'
							className='hidden'
						/>
						<Button type='button' variant='outline' size='sm' onClick={() => fileInputRef.current?.click()} className='text-xs border-zinc-700 bg-zinc-800'>
							Change Artwork
						</Button>
					</div>

					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='edit-title'>Album Title</Label>
							<Input
								id='edit-title'
								value={updatedAlbum.title}
								onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, title: e.target.value })}
								className='bg-zinc-800 border-zinc-700 focus:border-blue-500'
								placeholder='Enter album title'
								required
							/>
						</div>
						
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='edit-artist'>Artist</Label>
								<Input
									id='edit-artist'
									value={updatedAlbum.artist}
									onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, artist: e.target.value })}
									className='bg-zinc-800 border-zinc-700'
									placeholder='Enter artist'
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='edit-year'>Release Year</Label>
								<Input
									id='edit-year'
									type='number'
									value={updatedAlbum.releaseYear}
									onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, releaseYear: parseInt(e.target.value) })}
									className='bg-zinc-800 border-zinc-700'
									min={1900}
									max={new Date().getFullYear() + 1}
									required
								/>
							</div>
						</div>
					</div>

					<DialogFooter className='pt-2'>
						<Button type='button' variant='ghost' onClick={() => setDialogOpen(false)} disabled={isLoading} className='text-zinc-400'>
							Cancel
						</Button>
						<Button
							type='submit'
							className='bg-blue-600 hover:bg-blue-500 text-white font-bold px-8'
							disabled={isLoading}
						>
							{isLoading ? "Saving..." : "Update Album"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateAlbumDialog;
