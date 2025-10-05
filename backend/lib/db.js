import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("MongoDB connected:", conn.connection.host);
    } catch (err) {
        console.error("Error connection to MongoDB:", err);
        process.exit(1);
    }
};