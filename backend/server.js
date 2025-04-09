require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const fileUpload = require('express-fileupload');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(fileUpload());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Task Schema
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    day: { type: String, required: true },
  });
  

  // Task Model
const Task = mongoose.model('Task', taskSchema);

// Routes

// Add Task
app.post('/api/tasks', async (req, res) => {
  try {
    const { name, description, date } = req.body;

    // Calculate the day of the week
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

    // Create a new task
    const newTask = new Task({ name, description, date, day });
    await newTask.save();

    res.status(201).json({ message: 'Task added successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error adding task', error });
  }
});


// Get All Tasks
app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  });


// Edit Task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date } = req.body;

    // Log the incoming request body for debugging
    console.log('Request Body:', req.body);

    // Calculate the updated day of the week
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

    // Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, description, date, day },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error); // Log the error for debugging
    res.status(500).json({
      message: 'Error updating task',
      error: process.env.NODE_ENV === 'development' ? error.stack : error.message,
    });
  }
});

// Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});
  