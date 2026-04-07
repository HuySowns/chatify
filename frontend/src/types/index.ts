export interface Song {
	_id: string;
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

export interface Playlist {
	_id: string;
	title: string;
	description?: string;
	imageUrl?: string; // Bổ sung ảnh bìa cho Playlist
	userId: string;
	songs: Song[];
	createdAt: string;
	updatedAt: string;
}


export interface Genre {
	_id: string;
	name: string;
	description?: string;
}

export interface Favorite {
	_id: string;
	userId: string;
	targetId: string;
	targetType: "Song" | "Album";
}

export interface Comment {
	_id: string;
	userId: string;
	songId?: string;
	albumId?: string;
	content: string;
	createdAt: string;
	user?: User; // joined in some responses
}

export interface Notification {
	_id: string;
	userId: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	isRead: boolean;
	createdAt: string;
}

export interface Follow {
	_id: string;
	followerId: string;
	followingId: string;
}

export interface Transaction {
	_id: string;
	userId: string;
	amount: number;
	status: "pending" | "completed" | "failed" | "cancelled";
	paymentMethod: string;
	description: string;
	createdAt: string;
}
