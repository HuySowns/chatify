import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import type { Album } from "@/types";
import { Music, Eye } from "lucide-react";
import { useEffect } from "react";

interface AlbumDetailModalProps {
	album: Album;
}

const AlbumDetailModal = ({ album }: AlbumDetailModalProps) => {
	const { currentAlbum, fetchAlbumById } = useMusicStore();

	useEffect(() => {
		// Don't fetch if we already have the detailed album
		if (currentAlbum?._id === album._id) return;
	}, [album._id, currentAlbum]);

	const handleOpenChange = (open: boolean) => {
		if (open) {
			fetchAlbumById(album._id);
		}
	};

	const albumData = currentAlbum?._id === album._id ? currentAlbum : album;
	const songs = albumData.songs || [];

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
				>
					<Eye className='h-4 w-4' />
					View Details
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-700 max-w-2xl max-h-[80vh] overflow-y-auto'>
				<DialogHeader className='pb-4 border-b border-zinc-700'>
					<div className='flex items-start gap-4'>
						<img
							src={albumData.imageUrl}
							alt={albumData.title}
							className='w-24 h-24 rounded-lg object-cover'
						/>
						<div className='flex-1'>
							<DialogTitle className='text-2xl mb-2'>{albumData.title}</DialogTitle>
							<DialogDescription className='text-base mb-2'>Artist: {albumData.artist}</DialogDescription>
							<DialogDescription className='mb-2'>
								Release Year: {albumData.releaseYear}
							</DialogDescription>
							<div className='flex items-center gap-2 text-sm text-zinc-400'>
								<Music className='h-4 w-4' />
								<span>{songs.length} songs</span>
							</div>
						</div>
					</div>
				</DialogHeader>

				<div className='space-y-4'>
					<h3 className='font-semibold text-lg'>Songs in this album:</h3>
					{songs.length > 0 ? (
						<div className='rounded-lg border border-zinc-700/50 overflow-hidden'>
							<Table>
								<TableHeader>
									<TableRow className='hover:bg-zinc-800/50'>
										<TableHead className='w-[60px]'>#</TableHead>
										<TableHead>Title</TableHead>
										<TableHead>Artist</TableHead>
										<TableHead className='w-[100px] text-right'>Duration</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{songs.map((song: any, index: number) => (
										<TableRow key={song._id} className='hover:bg-zinc-800/30'>
											<TableCell className='text-zinc-400'>{index + 1}</TableCell>
											<TableCell className='font-medium'>{song.title}</TableCell>
											<TableCell>{song.artist}</TableCell>
											<TableCell className='text-right text-zinc-400'>
												{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className='text-center py-8 text-zinc-400'>
							<Music className='h-8 w-8 mx-auto mb-2 opacity-50' />
							<p>No songs in this album yet</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AlbumDetailModal;
