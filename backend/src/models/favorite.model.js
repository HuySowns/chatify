import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		targetId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			// Can ref Song or Album, depending on targetType
		},
		targetType: {
			type: String,
			enum: ["Song", "Album", "Playlist"],
			required: true,
		},
	},
	{ timestamps: true }
);

export const Favorite = mongoose.model("Favorite", favoriteSchema);
