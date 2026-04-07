import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2, Edit2 } from "lucide-react";
import UpdateSongDialog from "./UpdateSongDialog"; // MỚI

const SongsTable = () => {
	const { songs, isLoading, error, deleteSong } = useMusicStore();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading songs...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50 border-zinc-700'>
					<TableHead className='w-[60px]'>Img</TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Date</TableHead>
					<TableHead className='text-right px-6'>Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{songs.map((song) => (
					<TableRow key={song._id} className='hover:bg-zinc-800/50 border-zinc-800/50 group'>
						<TableCell>
							<img src={song.imageUrl} alt={song.title} className='size-10 rounded shadow-md object-cover border border-zinc-800' />
						</TableCell>
						<TableCell className='font-medium text-white'>{song.title}</TableCell>
						<TableCell className='text-zinc-300'>{song.artist}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1.5 text-zinc-400 text-xs'>
								<Calendar className='size-3.5' />
								{song.createdAt.split("T")[0]}
							</span>
						</TableCell>

						<TableCell className='text-right px-6'>
							<div className='flex gap-2 justify-end'>
								{/* MỚI: Nút Chỉnh sửa bài hát */}
								<UpdateSongDialog song={song} />

								<Button
									variant={"ghost"}
									size={"sm"}
									className='text-zinc-400 hover:text-red-500 hover:bg-red-500/10'
									onClick={() => {
										if (window.confirm("Are you sure you want to delete this song?")) {
											deleteSong(song._id);
										}
									}}
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
export default SongsTable;
