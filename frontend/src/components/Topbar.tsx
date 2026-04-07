import { useAuthStore } from "@/stores/useAuthStore";
import { useExtraStore } from "@/stores/useExtraStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Bell, LayoutDashboardIcon, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
	const { notifications, upgradeToPremium, isLoading } = useExtraStore();

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    '
		>
			<div className='flex gap-2 items-center'>
				<img src='/spotify.png' className='size-8' alt='Spotify logo' />
				Spotify
			</div>
			<div className='flex items-center gap-4'>
				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				)}

				<SignedOut>
					<div className='flex items-center gap-3'>
						<Link
							to='/login'
							className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-zinc-400 hover:text-white")}
						>
							Login
						</Link>
						<Link
							to='/signup'
							className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-white text-black hover:bg-white/90")}
						>
							Sign up
						</Link>
					</div>
				</SignedOut>
				<SignedIn>
					<div className='flex items-center gap-4'>
						<button
							onClick={upgradeToPremium}
							disabled={isLoading}
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"text-emerald-400 border-emerald-400/50 hover:bg-emerald-400/10 hidden sm:flex"
							)}
						>
							<Sparkles className='size-4 mr-2' />
							Upgrade
						</button>

						<div className='relative'>
							<Bell className='size-5 text-zinc-400 hover:text-white cursor-pointer' />
							{notifications.filter((n) => !n.isRead).length > 0 && (
								<span className='absolute -top-1 -right-1 size-2 bg-emerald-500 rounded-full' />
							)}
						</div>
					</div>
				</SignedIn>

				<UserButton />
			</div>
		</div>
	);
};
export default Topbar;
