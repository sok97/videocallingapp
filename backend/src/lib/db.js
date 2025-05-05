import mongo from 'mongoose';

export const connectDB = async () => {
    try {
        await mongo.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};