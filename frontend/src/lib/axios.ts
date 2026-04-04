import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
});

export const setupAxiosInterceptors = (getToken: () => Promise<string | null>) => {
	axiosInstance.interceptors.request.use(
		async (config) => {
			try {
				const token = await getToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			} catch (error) {
				console.error("Error getting token:", error);
			}
			return config;
		},
		(error) => Promise.reject(error)
	);
};
