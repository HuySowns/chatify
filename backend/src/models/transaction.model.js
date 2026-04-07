import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed", "cancelled"],
			default: "pending",
		},
		paymentMethod: {
			type: String,
			default: "credit_card",
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
