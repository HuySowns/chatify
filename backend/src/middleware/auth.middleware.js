import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	if (!req.auth.userId) {
		console.log("Unauthorized access attempt - no userId");
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	console.log("✓ Auth verified for user:", req.auth.userId);
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			console.log("Admin check failed for user:", currentUser.primaryEmailAddress?.emailAddress, "Expected:", process.env.ADMIN_EMAIL);
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		console.log("✓ Admin verified for user:", currentUser.primaryEmailAddress?.emailAddress);
		next();
	} catch (error) {
		console.error("Error in requireAdmin middleware:", error);
		next(error);
	}
};
