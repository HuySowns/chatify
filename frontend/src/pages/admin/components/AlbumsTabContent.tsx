import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Library, Search } from "lucide-react";
import { useState } from "react";
import AlbumsTable from "./AlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";

const AlbumsTabContent = () => {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<Card className='bg-zinc-800/50 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between mb-4'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Library className='h-5 w-5 text-violet-500' />
							Albums Library
						</CardTitle>
						<CardDescription>Manage and organize your albums</CardDescription>
					</div>
					<AddAlbumDialog />
				</div>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400' />
					<Input
						placeholder='Search albums by title or artist...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='bg-zinc-800 border-zinc-700 pl-10 focus:border-violet-500'
					/>
				</div>
			</CardHeader>

			<CardContent>
				<AlbumsTable searchTerm={searchTerm} />
			</CardContent>
		</Card>
	);
};
export default AlbumsTabContent;
