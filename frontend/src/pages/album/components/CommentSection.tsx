import { useSocialStore } from "@/stores/useSocialStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { MessageSquare, Trash2, Edit2, X, Check } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
	targetId: string;
	targetType: "Song" | "Album";
}

const CommentSection = ({ targetId, targetType }: CommentSectionProps) => {
	const { comments, fetchComments, postComment, deleteComment, updateComment } = useSocialStore();
	const { isAdmin } = useAuthStore();
	const { user } = useUser();
	
	const [newComment, setNewComment] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editContent, setEditContent] = useState("");

	useEffect(() => {
		fetchComments(targetId, targetType);
	}, [fetchComments, targetId, targetType]);

	const handleSubmit = async () => {
		if (!newComment.trim()) return;
		const data = targetType === "Song" ? { songId: targetId, content: newComment } : { albumId: targetId, content: newComment };
		await postComment(data);
		setNewComment("");
	};

	const handleEditStart = (id: string, content: string) => {
		setEditingId(id);
		setEditContent(content);
	};

	const handleEditCancel = () => {
		setEditingId(null);
		setEditContent("");
	};

	const handleEditSave = async (id: string) => {
		if (!editContent.trim()) return;
		await updateComment(id, editContent);
		setEditingId(null);
	};

	return (
		<div className='p-6 bg-zinc-900/50 rounded-lg mt-8 text-white'>
			<div className='flex items-center gap-2 mb-6'>
				<MessageSquare className='size-5 text-emerald-500' />
				<h2 className='text-xl font-bold'>Comments ({comments.length})</h2>
			</div>

			{/* Ô nhập bình luận mới */}
			<div className='mb-8'>
				<Textarea
					placeholder='Write a comment...'
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					className='bg-zinc-800 border-zinc-700 mb-2 focus:ring-emerald-500 text-zinc-100 min-h-[100px]'
				/>
				<div className='flex justify-end'>
					<Button onClick={handleSubmit} className='bg-emerald-500 hover:bg-emerald-400 text-black font-bold'>
						Post Comment
					</Button>
				</div>
			</div>

			{/* Danh sách bình luận */}
			<div className='space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar'>
				{comments.length === 0 && (
					<div className='text-center py-10 text-zinc-500 text-sm italic'>
						No comments yet. Be the first to share your thoughts!
					</div>
				)}
				
				{comments.map((comment) => {
					const commentUser = comment.userId;
					const isMyComment = user?.id === commentUser?.clerkId;
					const isEditing = editingId === comment._id;
					
					// Admin có quyền xóa mọi bình luận
					const canDelete = isMyComment || isAdmin;

					return (
						<div key={comment._id} className='flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300'>
							<Avatar className='size-10 border border-zinc-800 shrink-0'>
								<AvatarImage src={commentUser?.imageUrl} />
								<AvatarFallback>{commentUser?.fullName?.[0]}</AvatarFallback>
							</Avatar>
							
							<div className='flex-1 bg-zinc-800/30 p-3 rounded-lg group-hover:bg-zinc-800/50 transition-colors relative'>
								<div className='flex items-center justify-between mb-1'>
									<div className='flex items-center gap-2'>
										<h3 className={cn("font-semibold text-sm", isMyComment ? "text-emerald-400" : "text-white")}>
											{commentUser?.fullName}
										</h3>
										{isMyComment && <span className='text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded'>You</span>}
										{isAdmin && !isMyComment && <span className='text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded'>Admin</span>}
									</div>
									
									<div className='flex items-center gap-2'>
										<span className='text-[10px] text-zinc-500'>
											{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "just now"}
										</span>
										
										{!isEditing && (
											<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
												{isMyComment && (
													<button
														onClick={() => handleEditStart(comment._id, comment.content)}
														className='p-1 text-zinc-500 hover:text-emerald-400'
														title="Edit comment"
													>
														<Edit2 className='size-3.5' />
													</button>
												)}
												{canDelete && (
													<button
														onClick={() => deleteComment(comment._id)}
														className='p-1 text-zinc-500 hover:text-red-500'
														title="Delete comment"
													>
														<Trash2 className='size-3.5' />
													</button>
												)}
											</div>
										)}
									</div>
								</div>

								{isEditing ? (
									<div className='mt-2 space-y-2'>
										<Textarea 
											value={editContent}
											onChange={(e) => setEditContent(e.target.value)}
											className='bg-zinc-900 border-zinc-700 text-sm min-h-[80px]'
											autoFocus
										/>
										<div className='flex justify-end gap-2'>
											<Button size='sm' variant='ghost' onClick={handleEditCancel} className='h-8 text-xs'>
												<X className='size-3 mr-1' /> Cancel
											</Button>
											<Button size='sm' onClick={() => handleEditSave(comment._id)} className='h-8 text-xs bg-emerald-500 text-black'>
												<Check className='size-3 mr-1' /> Save
											</Button>
										</div>
									</div>
								) : (
									<p className='text-zinc-300 text-sm whitespace-pre-wrap'>{comment.content}</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CommentSection;
