import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useFollowStore } from "@/stores/useFollowStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect, useMemo } from "react";
import FollowButton from "@/components/FollowButton";

const FriendsActivity = () => {
	const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
	const { fetchFollowStats, following, followers } = useFollowStore();
	const { user } = useUser();

	useEffect(() => {
		if (user) {
			fetchUsers();
			fetchFollowStats();
		}
	}, [fetchUsers, fetchFollowStats, user]);

	// Lọc danh sách người dùng để chỉ hiển thị những người là "Bạn bè" (Mutual Follow)
	// Đảm bảo so sánh chính xác ID MongoDB (đã ép kiểu .toString())
	const mutualFriends = useMemo(() => {
		return users.filter((u) => {
			if (u.clerkId === user?.id) return false;

			// Kiểm tra điều kiện Follow chéo (Xử lý ObjectId/String/Populated)
			const iFollowThem = following.some((f) => {
				const fid = typeof f.followingId === "string" 
					? f.followingId 
					: (f.followingId as any)?._id?.toString() || f.followingId?.toString();
				return fid === u._id?.toString();
			});
			
			const theyFollowMe = followers.some((f) => {
				const fid = typeof f.followerId === "string" 
					? f.followerId 
					: (f.followerId as any)?._id?.toString() || f.followerId?.toString();
				return fid === u._id?.toString();
			});

			return iFollowThem && theyFollowMe;
		});
	}, [users, following, followers, user]);

	return (
		<div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
			<div className='p-4 flex justify-between items-center border-b border-zinc-800'>
				<div className='flex items-center gap-2'>
					<Users className='size-5 shrink-0' />
					<h2 className='font-semibold'>What they're listening to</h2>
				</div>
			</div>

			{!user && <LoginPrompt />}

			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{mutualFriends.length === 0 && user && (
						<div className='flex flex-col items-center justify-center h-full py-10 text-center px-4'>
							<Users className='size-10 text-zinc-700 mb-3' />
							<p className='text-sm text-zinc-400'>
								Only mutual friends can see each other's activity.
							</p>
							<p className='text-xs text-zinc-500 mt-1'>
								Follow someone and have them follow you back to see what they're listening to!
							</p>
						</div>
					)}
					
					{mutualFriends.map((item) => {
						const activity = userActivities.get(item.clerkId);
						const isPlaying = activity && activity !== "Idle";
						const isOnline = onlineUsers.has(item.clerkId);

						return (
							<div
								key={item._id}
								className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
							>
								<div className='flex items-start gap-3'>
									<div className='relative'>
										<Avatar className='size-10 border border-zinc-800'>
											<AvatarImage src={item.imageUrl} alt={item.fullName} />
											<AvatarFallback>{item.fullName[0]}</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
												${isOnline ? "bg-green-500" : "bg-zinc-500"}
												`}
											aria-hidden='true'
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												<span className='font-medium text-sm text-white'>{item.fullName}</span>
												{isPlaying && <Music className='size-3.5 text-emerald-400 shrink-0' />}
											</div>
										</div>

										<div className='mt-1 opacity-0 group-hover:opacity-100 transition-opacity'>
											<FollowButton userId={item._id} />
										</div>

										{isPlaying ? (
											<div className='mt-1'>
												<div className='mt-1 text-sm text-white font-medium truncate'>
													{activity.replace("Playing ", "").split(" by ")[0]}
												</div>
												<div className='text-xs text-zinc-400 truncate'>
													{activity.split(" by ")[1]}
												</div>
											</div>
										) : (
											<div className='mt-1 text-xs text-zinc-400 italic'>Idle</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};

export default FriendsActivity;

const LoginPrompt = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse'
				aria-hidden='true'
			/>
			<div className='relative bg-zinc-900 rounded-full p-4'>
				<HeadphonesIcon className='size-8 text-emerald-400' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
			<p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
		</div>
	</div>
);
