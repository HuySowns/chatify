import { useExtraStore } from "@/stores/useExtraStore";
import { cn } from "@/lib/utils";

const GenreFilter = () => {
	const { genres } = useExtraStore();

	return (
		<div className='flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide'>
			<button
				className={cn(
					"px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
					"bg-white text-black hover:bg-white/90"
				)}
			>
				All
			</button>
			{genres.map((genre) => (
				<button
					key={genre._id}
					className={cn(
						"px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
						"bg-zinc-800 text-white hover:bg-zinc-700"
					)}
				>
					{genre.name}
				</button>
			))}
		</div>
	);
};

export default GenreFilter;
