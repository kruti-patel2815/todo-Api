const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use local MongoDB for development
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoDB';
    
    console.log('🔗 Connecting to MongoDB...');
    
    // For Mongoose 7.x (no options needed)
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Host: ${mongoose.connection.host}`);
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

module.exports = connectDB;