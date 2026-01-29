require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');


const indexRouter = require('./routes/index');
const todoRouter = require('./routes/todoRoutes');
const connectDB = require('./config/db');


const Todo = require('./models/todo');

const app = express();


connectDB()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use('/', indexRouter);
app.use('/api/todos', todoRouter);


app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/home', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.render('home', { 
      title: 'Todo App',
      todos: todos 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.get('/todos/new', (req, res) => {
  res.render('addTodo', { title: 'Add Todo' });
});


app.post('/todos/new', async (req, res) => {
  const todo = new Todo(req.body); 
  await todo.save();
  res.redirect('/home');
});



app.get('/todos/edit/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.render('editTodo', { 
      title: 'Edit Todo',
      todo: todo 
    });
  } catch (err) {
    res.status(500).send('Error');
  }
});


app.post('/todos/edit/:id', async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    category: req.body.category,
    dueDate: req.body.dueDate
  });

  res.redirect('/home');
});



app.get('/todos/delete/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/home');
  } catch (err) {
    res.status(500).send('Error');
  }
});


module.exports = app;