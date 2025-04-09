import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';

const EditTaskForm = () => {
  const { id } = useParams(); // Get task ID from URL
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch task details by ID
  useEffect(() => {
    console.log('Task ID:', id); // Debugging: Log the task ID
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`);
        if (response.ok) {
          const task = await response.json();
          console.log('Fetched Task:', task); // Debugging: Log the fetched task
          setTaskName(task.name);
          setTaskDescription(task.description);
          setTaskDate(task.date.split('T')[0]); // Format date for input field
        } else {
          console.error('Failed to fetch task details');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTask();
  }, [id]);

  const handleEditTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taskName,
          description: taskDescription,
          date: taskDate, // Ensure this is in 'YYYY-MM-DD' format
        }),
      });
  
      if (response.ok) {
        alert('Task updated successfully');
        navigate('/dash'); // Navigate back to tasks page
      } else {
        console.error('Failed to update task');
        alert('Failed to update task. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the task. Please try again.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading indicator
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Task
      </Typography>
      <TextField
        label="Task Name"
        fullWidth
        margin="normal"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <TextField
        label="Task Description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <TextField
        label="Due Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={taskDate}
        onChange={(e) => setTaskDate(e.target.value)}
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/dash')}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditTask}
        >
          Edit Task
        </Button>
      </Box>
    </Box>
  );
};

export default EditTaskForm;