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
import { useExtraStore } from "@/stores/useExtraStore";
import { Plus, LayoutGrid } from "lucide-react";
import { useState } from "react";

const AddGenreDialog = () => {
	const { createGenre, isLoading } = useExtraStore();
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		imageUrl: "",
	});

	const handleSubmit = async () => {
		if (!formData.name.trim()) return;
		await createGenre(formData);
		setFormData({ name: "", description: "", imageUrl: "" });
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='bg-emerald-500 hover:bg-emerald-400 text-black font-bold'>
					<Plus className='mr-2 size-4' />
					Add Genre
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-800 text-white'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<LayoutGrid className='size-5 text-emerald-500' />
						Create New Genre
					</DialogTitle>
					<DialogDescription className='text-zinc-400'>
						Add a new music category to organize your songs.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 py-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Genre Name</Label>
						<Input
							id='name'
							placeholder='e.g., Lo-fi, Pop, Rock'
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='imageUrl'>Image URL (Optional)</Label>
						<Input
							id='imageUrl'
							placeholder='https://example.com/genre-image.jpg'
							value={formData.imageUrl}
							onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Description</Label>
						<Textarea
							id='description'
							placeholder='Describe this genre...'
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							className='bg-zinc-800 border-zinc-700 min-h-[100px]'
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant='ghost' onClick={() => setIsOpen(false)} className='text-zinc-400 hover:text-white'>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !formData.name.trim()}
						className='bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
					>
						{isLoading ? "Creating..." : "Create Genre"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddGenreDialog;
