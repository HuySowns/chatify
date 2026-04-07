import { useExtraStore } from "@/stores/useExtraStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, LayoutGrid } from "lucide-react";
import { useState } from "react";
import UpdateGenreDialog from "./UpdateGenreDialog"; // MỚI

const GenresTable = () => {
	const { genres, deleteGenre, isLoading } = useExtraStore();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this genre? Songs in this genre will remain but their category will be cleared.")) return;
		setIsDeleting(id);
		await deleteGenre(id);
		setIsDeleting(null);
	};

	if (genres.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center p-10 text-zinc-500'>
				<LayoutGrid className='size-12 mb-4 opacity-20' />
				<p>No genres found. Create your first category!</p>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50 border-zinc-700'>
					<TableHead className='w-[80px]'>Image</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Description</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{genres.map((genre) => (
					<TableRow key={genre._id} className='hover:bg-zinc-800/50 border-zinc-800/50 group'>
						<TableCell>
							{genre.imageUrl ? (
								<img src={genre.imageUrl} alt={genre.name} className='size-10 rounded object-cover border border-zinc-800 shadow-sm' />
							) : (
								<div className='size-10 bg-zinc-800 rounded flex items-center justify-center border border-zinc-700/50'>
									<LayoutGrid className='size-5 text-zinc-600' />
								</div>
							)}
						</TableCell>
						<TableCell className='font-medium text-white'>{genre.name}</TableCell>
						<TableCell className='text-zinc-400 max-w-xs truncate'>
							{genre.description || <span className='italic opacity-50 font-normal'>No description</span>}
						</TableCell>
						<TableCell className='text-right'>
							<div className='flex justify-end gap-2'>
								{/* MỚI: Nút chỉnh sửa Thể loại */}
								<UpdateGenreDialog genre={genre} /> 

								<Button
									variant='ghost'
									size='icon'
									className='text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors'
									onClick={() => handleDelete(genre._id)}
									disabled={isDeleting === genre._id}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default GenresTable;
