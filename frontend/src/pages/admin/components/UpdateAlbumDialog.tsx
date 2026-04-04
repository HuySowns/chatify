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
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { Edit2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Album } from "@/types";

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

	const handleSubmit = async () => {
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
			setImageFile(null);
			onSuccess?.();
		} catch (error: any) {
			toast.error("Failed to update album: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
				>
					<Edit2 className='h-4 w-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-700'>
				<DialogHeader>
					<DialogTitle>Update Album</DialogTitle>
					<DialogDescription>Update album details and artwork</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 py-4'>
					<input
						type='file'
						ref={fileInputRef}
						onChange={handleImageSelect}
						accept='image/*'
						className='hidden'
					/>
					<div
						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
						onClick={() => fileInputRef.current?.click()}
					>
						<div className='text-center'>
							<img
								src={previewImage}
								alt='Preview'
								className='w-20 h-20 rounded object-cover mb-2 mx-auto'
							/>
							<div className='text-sm text-zinc-400 mb-2'>
								{imageFile ? imageFile.name : "Click to change artwork"}
							</div>
							<Button variant='outline' size='sm' className='text-xs'>
								Change Image
							</Button>
						</div>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Album Title</label>
						<Input
							value={updatedAlbum.title}
							onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter album title'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Artist</label>
						<Input
							value={updatedAlbum.artist}
							onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, artist: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter artist name'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Release Year</label>
						<Input
							type='number'
							value={updatedAlbum.releaseYear}
							onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, releaseYear: parseInt(e.target.value) })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter release year'
							min={1900}
							max={new Date().getFullYear()}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => setDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-violet-500 hover:bg-violet-600'
						disabled={isLoading || !updatedAlbum.title || !updatedAlbum.artist}
					>
						{isLoading ? "Updating..." : "Update Album"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateAlbumDialog;
