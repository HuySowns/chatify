import { useExtraStore } from "@/stores/useExtraStore";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

const GenreFilter = () => {
	const { genres } = useExtraStore();
	const navigate = useNavigate();
	const { genreId: currentGenreId } = useParams();

	return (
		<div className='flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide'>
			{/* Nút lọc Tất cả (Back về Home) */}
			<button
				onClick={() => navigate("/")}
				className={cn(
					"px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
					!currentGenreId 
						? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" 
						: "bg-zinc-800 text-white hover:bg-zinc-700"
				)}
			>
				All
			</button>

			{/* Danh sách các Thể loại nhạc */}
			{genres.map((genre) => {
				const isActive = currentGenreId === genre._id;
				return (
					<button
						key={genre._id}
						onClick={() => navigate(`/genres/${genre._id}`)}
						className={cn(
							"px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
							isActive 
								? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" 
								: "bg-zinc-800 text-white hover:bg-zinc-700"
						)}
					>
						{genre.name}
					</button>
				);
			})}
		</div>
	);
};

export default GenreFilter;
