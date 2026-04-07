import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			sparse: true, // Allow nulls for clerk users
		},
		password: {
			type: String,
			// Not required because clerk users won't have a password
		},
		imageUrl: {
			type: String,
			required: true,
			default: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // Provide a default if they register locally without an image
		},
		clerkId: {
			type: String,
			unique: true,
			sparse: true, // Allow nulls for local users
		},
		currentSongId: {
			type: String,
			default: null,
		},
		currentPlaybackTime: {
			type: Number,
			default: 0,
		},
		isPremium: {
			type: Boolean,
			default: false, // Mặc định là tài khoản miễn phí
		},
	},
	{ timestamps: true } //  createdAt, updatedAt

);

export const User = mongoose.model("User", userSchema);
