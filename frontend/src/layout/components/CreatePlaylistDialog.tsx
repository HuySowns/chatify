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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Plus, Upload, Sparkles } from "lucide-react";
import { useState, useRef } from "react";

const CreatePlaylistDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { createPlaylist, playlists, isLoading } = useLibraryStore();
	const { isPremium } = useAuthStore();

	const isLimitReached = !isPremium && playlists.length >= 5;

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		if (imageFile) formData.append("imageFile", imageFile);

		await createPlaylist(formData);
		setIsOpen(false);
		resetForm();
	};

	const resetForm = () => {
		setTitle("");
		setDescription("");
		setImageFile(null);
		setImagePreview(null);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button className='p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white'>
					<Plus className='size-5' />
				</button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-800 text-white'>
				<DialogHeader>
					<DialogTitle>Create New Playlist</DialogTitle>
					<DialogDescription className='text-zinc-400'>
						{isLimitReached 
							? "Bạn đã đạt giới hạn 5 Playlist cho tài khoản miễn phí." 
							: "Give your playlist a name, an optional description, and a cover image."}
					</DialogDescription>
				</DialogHeader>

				{isLimitReached ? (
					<div className='py-8 flex flex-col items-center justify-center text-center space-y-4'>
						<div className='size-16 bg-emerald-500/10 rounded-full flex items-center justify-center'>
							<Sparkles className='size-8 text-emerald-500' />
						</div>
						<div>
							<h3 className='font-bold text-lg text-white'>Nâng cấp lên Premium</h3>
							<p className='text-zinc-400 text-sm mt-1'>
								Tài khoản miễn phí chỉ được tạo tối đa 5 Playlist.<br/>
								Hãy nâng cấp để tận hưởng không giới hạn!
							</p>
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className='space-y-4 py-4'>
						<div 
							className='flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-4 cursor-pointer hover:border-emerald-500 transition-colors bg-zinc-800/50'
							onClick={() => fileInputRef.current?.click()}
						>
							<input 
								type='file' 
								ref={fileInputRef} 
								hidden 
								accept='image/*' 
								onChange={handleImageChange} 
							/>
							{imagePreview ? (
								<img src={imagePreview} alt='Preview' className='w-full h-40 object-cover rounded-md' />
							) : (
								<div className='flex flex-col items-center text-zinc-500'>
									<Upload className='size-10 mb-2' />
									<span>Select cover image</span>
								</div>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='title'>Playlist Name</Label>
							<Input
								id='title'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder='My Awesome Playlist'
								className='bg-zinc-800 border-zinc-700'
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='description'>Description (Optional)</Label>
							<Textarea
								id='description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder='Add an optional description'
								className='bg-zinc-800 border-zinc-700 h-20 resize-none'
							/>
						</div>
						<DialogFooter>
							<Button
								type='button'
								variant='ghost'
								onClick={() => setIsOpen(false)}
								className='text-zinc-400 hover:text-white'
							>
								Cancel
							</Button>
							<Button
								type='submit'
								disabled={isLoading || !title.trim()}
								className='bg-white text-black hover:bg-white/90'
							>
								{isLoading ? "Creating..." : "Create Playlist"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default CreatePlaylistDialog;
