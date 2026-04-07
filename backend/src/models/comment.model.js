import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		songId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Song",
			// Optional if commenting on album instead
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			// Optional if commenting on song instead
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
