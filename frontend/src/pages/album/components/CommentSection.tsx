import { useSocialStore } from "@/stores/useSocialStore";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface CommentSectionProps {
	targetId: string;
	targetType: "Song" | "Album";
}

const CommentSection = ({ targetId, targetType }: CommentSectionProps) => {
	const { comments, fetchComments, postComment, deleteComment } = useSocialStore();
	const { user } = useUser();
	const [newComment, setNewComment] = useState("");

	useEffect(() => {
		fetchComments(targetId, targetType);
	}, [fetchComments, targetId, targetType]);

	const handleSubmit = async () => {
		if (!newComment.trim()) return;

		const data = targetType === "Song" ? { songId: targetId, content: newComment } : { albumId: targetId, content: newComment };
		await postComment(data);
		setNewComment("");
	};

	return (
		<div className='p-6 bg-zinc-900/50 rounded-lg mt-8'>
			<div className='flex items-center gap-2 mb-6'>
				<MessageSquare className='size-5 text-emerald-500' />
				<h2 className='text-xl font-bold'>Comments ({comments.length})</h2>
			</div>

			<div className='mb-8'>
				<Textarea
					placeholder='Write a comment...'
					value={newComment}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
					className='bg-zinc-800 border-zinc-700 mb-2 focus:ring-emerald-500'
				/>
				<div className='flex justify-end'>
					<Button onClick={handleSubmit} className='bg-emerald-500 hover:bg-emerald-400 text-black'>
						Post Comment
					</Button>
				</div>
			</div>

			<div className='space-y-6'>
				{comments.map((comment) => (
					<div key={comment._id} className='flex gap-4 group'>
						<Avatar className='size-10'>
							<AvatarImage src={comment.user?.imageUrl} />
							<AvatarFallback>{comment.user?.fullName?.[0]}</AvatarFallback>
						</Avatar>
						<div className='flex-1'>
							<div className='flex items-center justify-between mb-1'>
								<h3 className='font-medium text-white'>{comment.user?.fullName}</h3>
								<div className='flex items-center gap-3'>
									<span className='text-xs text-zinc-500'>
										{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
									</span>
									{user?.id === comment.userId && (
										<button
											onClick={() => deleteComment(comment._id)}
											className='text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity'
										>
											<Trash2 className='size-4' />
										</button>
									)}
								</div>
							</div>
							<p className='text-zinc-300 text-sm'>{comment.content}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CommentSection;
