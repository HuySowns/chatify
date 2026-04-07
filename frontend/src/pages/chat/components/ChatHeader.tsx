import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { useFollowStore } from "@/stores/useFollowStore";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();
	const { following, toggleFollow, isLoading } = useFollowStore();

	if (!selectedUser) return null;

	// Kiểm tra xem có đang follow selectedUser hay không
	// Dùng helper .toString() để so sánh chuẩn ID bất kể nó là string hay đã được populate thành object
	const isFollowing = following.some((f) => {
		const fid = typeof f.followingId === "string" 
			? f.followingId 
			: (f.followingId as any)?._id?.toString() || f.followingId?.toString();
		return fid === selectedUser._id?.toString();
	});

	return (
		<div className='p-4 border-b border-zinc-800 flex items-center justify-between'>
			<div className='flex items-center gap-3'>
				<Avatar className='border border-zinc-700 shadow-md'>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium text-white'>{selectedUser.fullName}</h2>
					<p className='text-xs text-zinc-400'>
						{onlineUsers.has(selectedUser.clerkId) ? (
							<span className='text-emerald-500'>Online</span>
						) : (
							"Offline"
						)}
					</p>
				</div>
			</div>

			<Button
				variant={isFollowing ? "outline" : "default"}
				size='sm'
				onClick={() => toggleFollow(selectedUser._id)}
				disabled={isLoading}
				className={cn(
					"transition-all rounded-full px-4 h-8 font-semibold",
					isFollowing 
						? "border-zinc-700 bg-zinc-800 text-white hover:text-red-400 hover:border-red-500/50" 
						: "bg-white text-black hover:bg-zinc-200"
				)}
			>
				{isFollowing ? (
					<>
						<UserMinus className='size-3.5 mr-2' />
						Unfollow
					</>
				) : (
					<>
						<UserPlus className='size-3.5 mr-2' />
						Follow
					</>
				)}
			</Button>
		</div>
	);
};
export default ChatHeader;
