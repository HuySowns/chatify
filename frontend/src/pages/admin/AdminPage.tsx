import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music, CreditCard, LayoutGrid } from "lucide-react"; // Bổ sung icon mới

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import GenresTabContent from "./components/GenresTabContent"; // MỚI
import TransactionsTable from "./components/TransactionsTable";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useExtraStore } from "@/stores/useExtraStore";

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();
	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
	const { fetchGenres } = useExtraStore();

	useEffect(() => {
		// Tải toàn bộ dữ liệu cần thiết cho trang Admin
		fetchAlbums();
		fetchSongs();
		fetchStats();
		fetchGenres();
	}, [fetchAlbums, fetchSongs, fetchStats, fetchGenres]);

	if (!isAdmin && !isLoading) return (
		<div className='h-screen w-full flex items-center justify-center text-white bg-black'>
			Unauthorized - Only Admins can access this page
		</div>
	);

	return (
		<div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8'>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
					{/* MỚI: Tab quản lý thể loại nhạc */}
					<TabsTrigger value='genres' className='data-[state=active]:bg-zinc-700'>
						<LayoutGrid className='mr-2 size-4' />
						Genres
					</TabsTrigger>
					<TabsTrigger value='transactions' className='data-[state=active]:bg-zinc-700'>
						<CreditCard className='mr-2 size-4' />
						Transactions
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
				{/* MỚI: Nội dung quản lý thể loại */}
				<TabsContent value='genres'>
					<GenresTabContent />
				</TabsContent>
				<TabsContent value='transactions'>
					<TransactionsTable />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default AdminPage;
