import mongoose from "mongoose";

export const connectDB = async () => {
    try {
      const conn =  await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        connectDB().catch((err) => console.error(err));
        console.log('MongoDB Connection Failed with', error.message);
        process.exit(1)
    }
}
