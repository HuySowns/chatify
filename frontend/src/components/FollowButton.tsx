import { Button } from "@/components/ui/button";
import { useFollowStore } from "@/stores/useFollowStore";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";

interface FollowButtonProps {
	userId: string;
	className?: string;
}

const FollowButton = ({ userId, className }: FollowButtonProps) => {
	const { user } = useUser();
	const { following, toggleFollow, isLoading } = useFollowStore();

	// Kiểm tra xem có đang follow user này hay không
	// Ép kiểu ID về String để so sánh chuẩn xác (Fix lỗi String vs ObjectId)
	const isFollowing = following.some((f) => {
		const fid = typeof f.followingId === "string" 
			? f.followingId 
			: (f.followingId as any)?._id?.toString() || f.followingId?.toString();
		return fid === userId?.toString();
	});


	const handleFollow = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) return;
		await toggleFollow(userId);
	};

	// Xử lý ẩn nút nếu là chính mình (So sánh Clerk ID với MongoDB ID là không đúng, nên để Backend chặn là chính)
	// nhma để an toàn ta cứ hiện nút cho đến khi có cách so sánh Clerk ID sang MongoDB ID ổn định hơn ở đây
	if (!user) return null;

	return (
		<Button
			variant={isFollowing ? "outline" : "default"}
			size='sm'
			className={cn("h-8 px-3 rounded-full gap-2 transition-all", isFollowing ? "bg-zinc-800 border-zinc-700" : "bg-white text-black hover:bg-white/90 font-bold", className)}
			onClick={handleFollow}
			disabled={isLoading}
		>
			{isFollowing ? (
				<>
					<UserCheck className='size-4' />
					Following
				</>
			) : (
				<>
					<UserPlus className='size-4' />
					Follow
				</>
			)}
		</Button>
	);
};

export default FollowButton;
