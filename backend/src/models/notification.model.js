import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			enum: ["system", "message", "new_song", "follow"],
			default: "system",
		},
		relatedId: {
			type: mongoose.Schema.Types.ObjectId,
			// Could be a messageId, songId, or followerId
		},
	},
	{ timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
