const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Vercel uses MONGODB_URI, but check for MONGO_URI as fallback
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/todoDB';
    
    if (!mongoUri) {
      throw new Error('MongoDB connection string is not defined');
    }
    
    console.log('Connecting to MongoDB...');
    
    // For Mongoose 7.x - remove deprecated options
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
    
    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

module.exports = connectDB;