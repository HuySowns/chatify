import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
		},
		imageUrl: {
			type: String,
		},
	},
	{ timestamps: true }
);

export const Genre = mongoose.model("Genre", genreSchema);
