const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://poorva:poorva@cluster0.txkokqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  picture: String
});

const User = mongoose.model('User', userSchema);

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  email: String
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/user', async (req, res) => {
  try {
    const user = new User(req.body);
    const existingUser = await User.findOne({ googleId: user.googleId });

    if (existingUser) {
      res.json(existingUser);
    } else {
      await user.save();
      res.status(201).send(user);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/todos/:email', async (req, res) => {
  try {
    const todos = await Todo.find({ email: req.params.email });
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Use process.env.PORT
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running');
});