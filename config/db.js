const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');

    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('MongoDB Connected!');
    return mongoose.connection;
  } catch (error) {
    console.error('Connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;