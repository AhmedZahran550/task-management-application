import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error('DB_URL is not defined in environment variables');
    }

    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(dbUrl);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${(error as Error).message}`);
    process.exit(1);
  }
};
