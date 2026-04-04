import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import UpdateAlbumDialog from "./UpdateAlbumDialog";
import AlbumDetailModal from "./AlbumDetailModal";

interface AlbumsTableProps {
	searchTerm?: string;
}

const AlbumsTable = ({ searchTerm = "" }: AlbumsTableProps) => {
	const { albums, deleteAlbum, fetchAlbums } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const filteredAlbums = useMemo(() => {
		if (!searchTerm.trim()) return albums;

		const term = searchTerm.toLowerCase();
		return albums.filter(
			(album) =>
				album.title.toLowerCase().includes(term) ||
				album.artist.toLowerCase().includes(term)
		);
	}, [albums, searchTerm]);

	return (
		<div className='rounded-lg border border-zinc-700/50 overflow-hidden'>
			<Table>
				<TableHeader>
					<TableRow className='hover:bg-zinc-800/50 border-b border-zinc-700/50'>
						<TableHead className='w-[50px]'></TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Artist</TableHead>
						<TableHead>Release Year</TableHead>
						<TableHead>Songs</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredAlbums.length > 0 ? (
						filteredAlbums.map((album) => (
							<TableRow key={album._id} className='hover:bg-zinc-800/30 border-b border-zinc-700/30'>
								<TableCell>
									<img
										src={album.imageUrl}
										alt={album.title}
										className='w-10 h-10 rounded object-cover shadow-md'
									/>
								</TableCell>
								<TableCell className='font-medium text-zinc-100'>{album.title}</TableCell>
								<TableCell className='text-zinc-300'>{album.artist}</TableCell>
								<TableCell>
									<span className='inline-flex items-center gap-1 text-zinc-400'>
										<Calendar className='h-4 w-4' />
										{album.releaseYear}
									</span>
								</TableCell>
								<TableCell>
									<span className='inline-flex items-center gap-1 text-zinc-400'>
										<Music className='h-4 w-4' />
										{album.songs.length} songs
									</span>
								</TableCell>
								<TableCell className='text-right'>
									<div className='flex gap-2 justify-end'>
										<AlbumDetailModal album={album} />
										<UpdateAlbumDialog album={album} />
										<Button
											variant='ghost'
											size='sm'
											onClick={() => deleteAlbum(album._id)}
											className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={6} className='text-center py-8 text-zinc-400'>
								{searchTerm.trim() ? (
									<div>
										<Music className='h-8 w-8 mx-auto mb-2 opacity-50' />
										<p>No albums found matching "{searchTerm}"</p>
									</div>
								) : (
									<div>
										<Music className='h-8 w-8 mx-auto mb-2 opacity-50' />
										<p>No albums yet. Create one to get started!</p>
									</div>
								)}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};
export default AlbumsTable;
