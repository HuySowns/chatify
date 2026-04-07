import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useExtraStore } from "@/stores/useExtraStore";
import { Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface UpgradeDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const UpgradeDialog = ({ isOpen, onOpenChange }: UpgradeDialogProps) => {
	const { upgradeToPremium, isLoading } = useExtraStore();
	const [step, setStep] = useState<"info" | "payment" | "success">("info");

	const handleUpgrade = async () => {
		await upgradeToPremium();
		setStep("success");
	};

	const resetAndClose = () => {
		onOpenChange(false);
		setTimeout(() => setStep("info"), 300);
	};

	// Giả lập thông tin thanh toán (ví dụ Momo hoặc Bank)
	const paymentAmount = "99.000";
	const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CHATAIFY_PREMIUM_UPGRADE_USER`;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='bg-zinc-900 border-zinc-800 text-white sm:max-w-[400px]'>
				{step === "info" && (
					<>
						<DialogHeader>
							<DialogTitle className='flex items-center gap-2 text-2xl'>
								<Sparkles className='size-6 text-emerald-500' />
								Upgrade to Premium
							</DialogTitle>
							<DialogDescription className='text-zinc-400'>
								Unlock the full potential of Chatify.
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4 py-4'>
							<div className='bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-3'>
								<div className='flex items-start gap-3'>
									<CheckCircle2 className='size-5 text-emerald-500 mt-0.5' />
									<div>
										<p className='font-medium'>Unlimited Playlists</p>
										<p className='text-sm text-zinc-400'>Create as many as you want.</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<CheckCircle2 className='size-5 text-emerald-500 mt-0.5' />
									<div>
										<p className='font-medium'>Exclusive Content</p>
										<p className='text-sm text-zinc-400'>Access premium-only songs & albums.</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<CheckCircle2 className='size-5 text-emerald-500 mt-0.5' />
									<div>
										<p className='font-medium'>Ad-free Listening</p>
										<p className='text-sm text-zinc-400'>Enjoy music without interruptions.</p>
									</div>
								</div>
							</div>
							<div className='text-center'>
								<p className='text-3xl font-bold text-white'>{paymentAmount} VNĐ</p>
								<p className='text-sm text-zinc-500'>One-time payment</p>
							</div>
						</div>
						<DialogFooter>
							<Button 
								className='w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg'
								onClick={() => setStep("payment")}
							>
								Upgrade Now
							</Button>
						</DialogFooter>
					</>
				)}

				{step === "payment" && (
					<>
						<DialogHeader>
							<DialogTitle>Scan to Pay</DialogTitle>
							<DialogDescription className='text-zinc-400'>
								Scan the QR code below to complete your payment.
							</DialogDescription>
						</DialogHeader>
						<div className='flex flex-col items-center justify-center py-6 space-y-6'>
							<div className='bg-white p-3 rounded-xl shadow-2xl'>
								<img src={qrCodeUrl} alt='Payment QR' className='size-48' />
							</div>
							<div className='text-center space-y-1'>
								<p className='text-emerald-500 font-bold flex items-center justify-center gap-2'>
									<ShieldCheck className='size-4' />
									Secure Payment
								</p>
								<p className='text-xs text-zinc-500'>Please confirm after payment is done.</p>
							</div>
						</div>
						<DialogFooter className='flex-col gap-2 sm:flex-col'>
							<Button 
								className='w-full bg-white text-black hover:bg-zinc-200 h-11 font-bold'
								onClick={handleUpgrade}
								disabled={isLoading}
							>
								{isLoading ? "Verifying..." : "I have paid"}
							</Button>
							<Button 
								variant='ghost' 
								className='w-full text-zinc-500'
								onClick={() => setStep("info")}
								disabled={isLoading}
							>
								Go Back
							</Button>
						</DialogFooter>
					</>
				)}

				{step === "success" && (
					<div className='py-10 flex flex-col items-center text-center space-y-6'>
						<div className='size-20 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.4)]'>
							<CheckCircle2 className='size-12 text-zinc-900' />
						</div>
						<div className='space-y-2'>
							<h2 className='text-2xl font-bold text-white'>Welcome to Premium!</h2>
							<p className='text-zinc-400'>Your account has been successfully upgraded.</p>
						</div>
						<Button 
							className='w-full bg-zinc-800 hover:bg-zinc-700 text-white'
							onClick={resetAndClose}
						>
							Start Listening
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default UpgradeDialog;
