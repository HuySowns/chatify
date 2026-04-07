import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import GenresTable from "./GenresTable";
import AddGenreDialog from "./AddGenreDialog";

const GenresTabContent = () => {
	return (
		<Card className='bg-zinc-800/50 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<LayoutGrid className='size-5 text-emerald-500' />
							Music Genres
						</CardTitle>
						<CardDescription>Manage your music categorization</CardDescription>
					</div>
					<AddGenreDialog />
				</div>
			</CardHeader>
			<CardContent>
				<GenresTable />
			</CardContent>
		</Card>
	);
};

export default GenresTabContent;
