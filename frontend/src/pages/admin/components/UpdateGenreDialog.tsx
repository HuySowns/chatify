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
import { Genre } from "@/types";
import { useExtraStore } from "@/stores/useExtraStore";
import { Edit2, LayoutGrid } from "lucide-react";
import { useState } from "react";

interface UpdateGenreDialogProps {
	genre: Genre;
}

const UpdateGenreDialog = ({ genre }: UpdateGenreDialogProps) => {
	const { updateGenre, isLoading } = useExtraStore();
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: genre.name,
		description: genre.description || "",
		imageUrl: genre.imageUrl || "",
	});

	const handleSubmit = async () => {
		if (!formData.name.trim()) return;
		await updateGenre(genre._id, formData);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='ghost' size='sm' className='text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10'>
					<Edit2 className='size-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-800 text-white'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<LayoutGrid className='size-5 text-emerald-500' />
						Edit Genre
					</DialogTitle>
					<DialogDescription className='text-zinc-400'>
						Modify the details for category: <b>{genre.name}</b>
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 py-4'>
					<div className='space-y-2'>
						<Label htmlFor='edit-name'>Genre Name</Label>
						<Input
							id='edit-name'
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='edit-imageUrl'>Image URL</Label>
						<Input
							id='edit-imageUrl'
							placeholder='https://example.com/image.jpg'
							value={formData.imageUrl}
							onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='edit-description'>Description</Label>
						<Textarea
							id='edit-description'
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							className='bg-zinc-800 border-zinc-700 min-h-[100px]'
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant='ghost' onClick={() => setIsOpen(false)} className='text-zinc-400 border-zinc-700'>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !formData.name.trim()}
						className='bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
					>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateGenreDialog;
