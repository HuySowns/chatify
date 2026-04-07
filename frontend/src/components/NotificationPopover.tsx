import { Bell, Check, Trash2, User, MessageSquare, Info } from "lucide-react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuHeader,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useExtraStore } from "@/stores/useExtraStore";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns"; // Để hiển thị "5m ago"
import { cn } from "@/lib/utils";

const NotificationPopover = () => {
	const { notifications, markNotificationAsRead, clearNotifications, isLoading } = useExtraStore();
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const getIcon = (type: string) => {
		switch (type) {
			case "follow":
				return <User className='size-4 text-emerald-500' />;
			case "message":
				return <MessageSquare className='size-4 text-blue-500' />;
			default:
				return <Info className='size-4 text-zinc-400' />;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className='relative cursor-pointer group'>
					<Bell className='size-5 text-zinc-400 group-hover:text-white transition-colors' />
					{unreadCount > 0 && (
						<span className='absolute -top-1 -right-1 size-4 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-zinc-900'>
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end' className='w-80 bg-zinc-900 border-zinc-800 p-0 shadow-2xl'>
				<div className='flex items-center justify-between p-4 border-b border-zinc-800'>
					<h3 className='font-bold text-white text-sm'>Notifications</h3>
					{notifications.length > 0 && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => clearNotifications()}
							className='h-auto p-0 text-xs text-zinc-400 hover:text-red-400'
						>
							<Trash2 className='size-3 mr-1' />
							Clear All
						</Button>
					)}
				</div>

				<ScrollArea className='h-[400px]'>
					{notifications.length === 0 ? (
						<div className='flex flex-col items-center justify-center p-8 text-center text-zinc-500'>
							<Bell className='size-8 mb-2 opacity-20' />
							<p className='text-xs'>No notifications yet</p>
						</div>
					) : (
						<div className='divide-y divide-zinc-800/50'>
							{notifications.map((notification) => (
								<DropdownMenuItem
									key={notification._id}
									className={cn(
										"flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-zinc-800 group",
										!notification.isRead && "bg-emerald-500/5"
									)}
									onClick={() => !notification.isRead && markNotificationAsRead(notification._id)}
								>
									<div className='flex items-start gap-3 w-full'>
										<div className='mt-1'>{getIcon(notification.type)}</div>
										<div className='flex-1 space-y-1'>
											<p className={cn("text-xs leading-relaxed", !notification.isRead ? "text-zinc-100 font-medium" : "text-zinc-400")}>
												{notification.message}
											</p>
											<span className='text-[10px] text-zinc-500'>
												{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
											</span>
										</div>
										{!notification.isRead && (
											<div className='size-2 bg-emerald-500 rounded-full mt-1 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]' />
										)}
									</div>
								</DropdownMenuItem>
							))}
						</div>
					)}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default NotificationPopover;
