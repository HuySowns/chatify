import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";

export const getFollows = async (req, res, next) => {
	try {
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Lấy danh sách những người mà User đang theo dõi (Following)
		const following = await Follow.find({ followerId: user._id }).populate("followingId", "fullName imageUrl");
		
		// Lấy danh sách những người đang theo dõi User này (Followers)
		const followers = await Follow.find({ followingId: user._id }).populate("followerId", "fullName imageUrl");

		res.json({ following, followers });
	} catch (error) {
		next(error);
	}
};


export const toggleFollow = async (req, res, next) => {
	try {
		const { followingId } = req.body; // ID người bị theo dõi
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const follower = await User.findOne({ clerkId });
		if (!follower) return res.status(404).json({ message: "Follower not found" });

		// Đảm bảo không tự follow chính mình
		if (follower._id.toString() === followingId) {
			return res.status(400).json({ message: "You cannot follow yourself" });
		}

		// Kiểm tra xem đã theo dõi chưa
		const existingFollow = await Follow.findOne({
			followerId: follower._id,
			followingId,
		});

		if (existingFollow) {
			// Nếu đã follow rồi thì xóa đi (Unfollow)
			await Follow.findByIdAndDelete(existingFollow._id);
			res.status(200).json({ message: "Unfollowed successfully", isFollowing: false });
		} else {
			// Nếu chưa follow thì thêm mới (Follow)
			const follow = await Follow.create({
				followerId: follower._id,
				followingId,
			});
			res.status(201).json({ ...follow.toJSON(), isFollowing: true });
		}
	} catch (error) {
		console.log("Error in toggleFollow", error);
		next(error);
	}
};

export const deleteFollow = async (req, res, next) => {
	try {
		await Follow.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Follow deleted" });
	} catch (error) {
		next(error);
	}
};
