import mongoose from 'mongoose';

const connectionStr =
  process.env.MONGO_URI || 'mongodb://localhost:27017/mongoose_exercise';

export default async function connect() {
  try {
    await mongoose.connect(connectionStr);
    console.log('Successfully connected to MongoDB server');
    return mongoose.connection;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
}
