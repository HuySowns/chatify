import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExtraStore } from "@/stores/useExtraStore";
import { Trash2, CreditCard, User, Calendar } from "lucide-react";
import { useEffect } from "react";

const TransactionsTable = () => {
	const { transactions, fetchAllTransactions, deleteTransaction, isLoading } = useExtraStore();

	useEffect(() => {
		fetchAllTransactions();
	}, [fetchAllTransactions]);

	if (isLoading) {
		return <div className='flex items-center justify-center py-8'>Loading transactions...</div>;
	}

	return (
		<div className='rounded-lg border border-zinc-700/50 overflow-hidden bg-zinc-900/30'>
			<Table>
				<TableHeader>
					<TableRow className='hover:bg-zinc-800/50 border-b border-zinc-700/50'>
						<TableHead className='w-[250px]'>User</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Date</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.length > 0 ? (
						transactions.map((tx: any) => (
							<TableRow key={tx._id} className='hover:bg-zinc-800/30 border-b border-zinc-700/30'>
								<TableCell>
									<div className='flex items-center gap-3'>
										{tx.userId?.imageUrl ? (
											<img src={tx.userId.imageUrl} className='size-8 rounded-full object-cover' alt='' />
										) : (
											<div className='size-8 rounded-full bg-zinc-800 flex items-center justify-center'>
												<User className='size-4 text-zinc-400' />
											</div>
										)}
										<div className='flex flex-col'>
											<span className='font-medium text-zinc-100'>{tx.userId?.fullName || "Unknown User"}</span>
											<span className='text-xs text-zinc-500'>{tx.userId?.clerkId}</span>
										</div>
									</div>
								</TableCell>
								<TableCell className='text-zinc-300'>{tx.description}</TableCell>
								<TableCell>
									<span className='inline-flex items-center gap-1 text-emerald-400 font-medium'>
										{tx.amount.toLocaleString()} VNĐ
									</span>
								</TableCell>
								<TableCell>
									<span className='px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'>
										{tx.status}
									</span>
								</TableCell>
								<TableCell className='text-zinc-400'>
									<div className='flex items-center gap-1'>
										<Calendar className='size-3' />
										{new Date(tx.createdAt).toLocaleDateString()}
									</div>
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => {
											if (confirm("Are you sure you want to delete this transaction record?")) {
												deleteTransaction(tx._id);
											}
										}}
										className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={6} className='text-center py-12 text-zinc-400'>
								<div className='flex flex-col items-center justify-center space-y-2'>
									<CreditCard className='size-8 opacity-20' />
									<p>No transactions found</p>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default TransactionsTable;
