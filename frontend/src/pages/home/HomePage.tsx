import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useExtraStore } from "@/stores/useExtraStore";

import GenreFilter from "./components/GenreFilter";
import GenreGrid from "./components/GenreGrid"; // MỚI: Danh mục thể loại đầy màu sắc

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { fetchGenres } = useExtraStore();
	const { initializeQueue } = usePlayerStore();

	useEffect(() => {
		// Tải dữ liệu trang chủ
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
		fetchGenres(); // Tải danh sách thể loại để hiển thị
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, fetchGenres]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-120px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Good afternoon</h1>
					
					{/* Thanh lọc nhanh */}
					<GenreFilter />
					
					{/* Mục Nổi bật */}
					<FeaturedSection />

					<div className='space-y-8 mt-8'>
						{/* MỚI: Mục Khám phá thể loại (Colorful Grid) */}
						<GenreGrid />

						{/* Danh mục bài hát đề xuất */}
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
