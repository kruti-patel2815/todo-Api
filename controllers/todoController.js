const Todo = require('../models/todo');

exports.createTodo = async (req, res) => {
  const todo = await Todo.create(req.body);
  res.status(201).json(todo);
};

exports.getTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

exports.updateTodo = async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
};

exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
};
