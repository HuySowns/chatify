import { useExtraStore } from "@/stores/useExtraStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const GenreGrid = () => {
	const { genres, isLoading } = useExtraStore();
	const navigate = useNavigate();

	if (isLoading) return null;

	// Một số màu sắc gradient đẹp mắt cho danh mục
	const gradients = [
		"from-emerald-500 to-emerald-700",
		"from-blue-500 to-blue-700",
		"from-purple-500 to-purple-700",
		"from-pink-500 to-pink-700",
		"from-amber-500 to-amber-700",
		"from-rose-500 to-rose-700",
		"from-indigo-500 to-indigo-700",
		"from-cyan-500 to-cyan-700",
	];

	return (
		<div className='mb-8'>
			<h2 className='text-xl sm:text-2xl font-bold mb-4 px-1'>Browse Categories</h2>
			
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
				{genres.map((genre, index) => (
					<div
						key={genre._id}
						onClick={() => navigate(`/genres/${genre._id}`)}
						className={cn(
							"relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all",
							`bg-gradient-to-br ${gradients[index % gradients.length]}`
						)}
					>
						{/* Tên Thể loại */}
						<div className='p-4'>
							<h3 className='text-white font-bold text-lg sm:text-xl md:text-2xl break-words'>
								{genre.name}
							</h3>
						</div>

						{/* Hình ảnh (nghiêng góc như Spotify nếu có) */}
						{genre.imageUrl && (
							<div className='absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 translate-x-4 translate-y-4 rotate-25 shadow-xl transition-transform group-hover:scale-110'>
								<img 
									src={genre.imageUrl} 
									alt={genre.name} 
									className='w-full h-full object-cover rounded shadow-2xl border border-white/10'
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default GenreGrid;
