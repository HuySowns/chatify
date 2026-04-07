import { Button } from "@/components/ui/button";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";

interface LikeButtonProps {
	targetId: string;
	targetType: "Song" | "Album" | "Playlist";
	className?: string;
}

const LikeButton = ({ targetId, targetType, className }: LikeButtonProps) => {
	const { isSignedIn } = useUser();
	const { favorites, toggleFavorite } = useLibraryStore();
	
	// Kiểm tra xem bài hát/album này đã được Like chưa
	const isLiked = favorites.some((f) => f.targetId === targetId);

	const handleToggle = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isSignedIn) return;
		await toggleFavorite(targetId, targetType as any);
	};

	if (!isSignedIn) return null;

	return (
		<Button
			variant='ghost'
			size='icon'
			className={cn("hover:bg-transparent hover:scale-110 transition-transform", className)}
			onClick={handleToggle}
		>
			<Heart
				className={cn("size-5 transition-colors", isLiked ? "fill-emerald-500 text-emerald-500" : "text-zinc-400")}
			/>
		</Button>
	);
};

export default LikeButton;
