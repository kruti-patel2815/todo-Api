const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String, default: '' },

  completed: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },

  category: {
    type: String,
    default: 'general'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  dueDate: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});



module.exports = mongoose.model('Todo', todoSchema, 'todos');  