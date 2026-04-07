import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { useSocialStore } from "@/stores/useSocialStore";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();
	const { follows, toggleFollow } = useSocialStore();

	if (!selectedUser) return null;

	const isFollowing = follows.some((f) => f.followingId === selectedUser.clerkId);

	return (
		<div className='p-4 border-b border-zinc-800 flex items-center justify-between'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.fullName}</h2>
					<p className='text-sm text-zinc-400'>
						{onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
					</p>
				</div>
			</div>

			<Button
				variant={isFollowing ? "outline" : "default"}
				size='sm'
				onClick={() => toggleFollow(selectedUser.clerkId)}
				className={cn(
					"transition-all",
					isFollowing ? "border-zinc-700 text-zinc-400 hover:text-white" : "bg-emerald-500 text-black hover:bg-emerald-400"
				)}
			>
				{isFollowing ? (
					<>
						<UserMinus className='size-4 mr-2' />
						Unfollow
					</>
				) : (
					<>
						<UserPlus className='size-4 mr-2' />
						Follow
					</>
				)}
			</Button>
		</div>
	);
};
export default ChatHeader;
