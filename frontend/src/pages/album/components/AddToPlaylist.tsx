import { useLibraryStore } from "@/stores/useLibraryStore";
import { PlusCircle } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

interface AddToPlaylistProps {
	songId: string;
}

const AddToPlaylist = ({ songId }: AddToPlaylistProps) => {
	const { playlists, addSongToPlaylist } = useLibraryStore();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					onClick={(e: React.MouseEvent) => e.stopPropagation()}
					className='hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white'
				>
					<PlusCircle className='size-4' />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-zinc-900 border-zinc-800 text-white w-56'>
				<DropdownMenuLabel>Add to Playlist</DropdownMenuLabel>
				<DropdownMenuSeparator className='bg-zinc-800' />
				{playlists.length === 0 ? (
					<div className='p-2 text-xs text-zinc-500'>No playlists created</div>
				) : (
					playlists.map((playlist) => (
						<DropdownMenuItem
							key={playlist._id}
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								addSongToPlaylist(playlist._id, songId);
							}}
							className='hover:bg-zinc-800 cursor-pointer'
						>
							{playlist.title}
						</DropdownMenuItem>
					))
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AddToPlaylist;
