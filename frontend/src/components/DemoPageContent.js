
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import DialogActions from '@mui/material/DialogActions';
import { Dialog, DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';


const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
   
  },
  {
    segment: 'tasks',
    title: 'Tasks',
    icon: <TaskIcon />,

  },
];

// Define colors for each day of the week
const dayColors = {
  Monday: '#FFCDD2',
  Tuesday: '#F8BBD0',
  Wednesday: '#E1BEE7',
  Thursday: '#D1C4E9',
  Friday: '#C5CAE9',
  Saturday: '#BBDEFB',
  Sunday: '#B2EBF2',
};

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {

  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // Assuming you have a useNavigate hook or similar for navigation
  const [mode, setMode] = useState('light'); // State to toggle between light and dark mode

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddTask = async () => {
    if (taskName && taskDate) {
      // Extract the day of the week from the taskDate
      const day = new Date(taskDate).toLocaleDateString('en-US', { weekday: 'long' });
  
      try {
        const response = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: taskName,
            description: taskDescription,
            date: taskDate,
            day, // Include the day property
          }),
        });
  
        if (response.ok) {
          fetchTasks(); // Fetch updated tasks
          setTaskName('');
          setTaskDescription('');
          setTaskDate('');
          handleClose();
          navigate('/dash'); // Navigate to the tasks page
        } else {
          console.error('Failed to add task');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);


  
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) {
      return; // Exit if the user cancels the confirmation
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        fetchTasks(); // Refresh the task list after deletion
        navigate('/dash'); // Navigate to the tasks page
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Define the theme with dynamic mode
  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0b0b0',
        },
      }),
      ...(mode === 'light' && {
        background: {
          default: '#ffffff',
          paper: '#f5f5f5',
        },
        text: {
          primary: '#000000',
          secondary: '#4f4f4f',
        },
      }),
    },
  });



  return (

    <ThemeProvider theme={theme}>
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: theme.palette.background.default, // Dynamic background
          color: theme.palette.text.primary, // Dynamic text color
          minHeight: '100vh', // Ensure the box covers the full viewport height
      }}
    >



{pathname === '/dashboard' && (
  <>
    <Typography variant="h4" sx={{ mb: 4 }}>
      Dashboard
    </Typography>


    {/* Task Counts by Day */}
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      {Object.keys(dayColors).map((day) => {
        const dayTaskCount = tasks.filter((task) => task.day === day).length;

        return (
          <Box
            key={day}
            sx={{
              backgroundColor: dayColors[day],
              borderRadius: 2,
              p: 2,
              minWidth: 150,
              textAlign: 'center',
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'black',
              }}
            >
              {day}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'black',
              }}
            >
              {dayTaskCount}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'black',
              }}
            >
              Tasks
            </Typography>
          </Box>
        );
      })}
    </Box>

    
    {/* Total Tasks Card */}
    <Card sx={{ mb: 4, width: '100%', maxWidth: 400, mx: 'auto', boxShadow: 3 }}>
      <CardHeader title="Total Tasks" />
      <CardContent>
        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {tasks.length}
        </Typography>
      </CardContent>
    </Card>

   {/* Bar Chart */}
   <Box 
    sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          mb: 4,
          backgroundColor: theme.palette.background.paper, // Dynamic background
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
   }}
   >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Tasks by Day (Bar Chart)
        </Typography>
        <BarChart
          width={600}
          height={300}
          data={Object.keys(dayColors).map((day) => ({
            day,
            count: tasks.filter((task) => task.day === day).length,
          }))}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </Box>


     {/* Pie Chart */}
     <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Tasks by Day (Pie Chart)
        </Typography>
        <PieChart width={300} height={500}>
          <Pie
            data={Object.keys(dayColors).map((day) => ({
              name: day,
              value: tasks.filter((task) => task.day === day).length,
            }))}
            cx="50%"
            cy="50%"
            outerRadius={150}
            // fill="#8884d8"
            dataKey="value"
            label
          >
            {Object.keys(dayColors).map((day, index) => (
              <Cell key={`cell-${index}`} fill={dayColors[day]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </Box>


  </>
)}

      {pathname === '/tasks' && (
        <>
           <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              px: 2,
              mt: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'green', borderRadius: 2, p: 2 }}>
            <Typography variant="h5" sx={{ textAlign: 'left', color: 'white', fontWeight: 'bold' }}>
              Your Daily Tasks
            </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{ textTransform: 'none' }}
            >
              Add Task
            </Button>
          </Box>

          <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Add New Task</DialogTitle>
  <DialogContent>
    {/* Task Title Field */}
    <TextField
      autoFocus
      margin="dense"
      label="Task Title"
      type="text"
      fullWidth
      variant="standard"
      value={taskName}
      onChange={(e) => setTaskName(e.target.value)}
    />

    {/* Task Description Field */}
<TextField
  margin="dense"
  label="Task Description"
  type="text"
  fullWidth
  variant="standard"
  multiline
  rows={3}
  value={taskDescription} // Add value
  onChange={(e) => setTaskDescription(e.target.value)} // Add onChange
/>

{/* Task Date Field */}
<TextField
  margin="dense"
  label="Due Date"
  type="date"
  fullWidth
  InputLabelProps={{
    shrink: true,
  }}
  value={taskDate} // Add value
  onChange={(e) => setTaskDate(e.target.value)} // Add onChange
/>
  
  </DialogContent>

  <DialogActions>
    {/* Cancel Button */}
    <Button onClick={handleClose} sx={{ color: 'white', backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}>
      Cancel
    </Button>

    {/* Add Task Button */}
    <Button onClick={handleAddTask} sx={{ color: 'white', backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}>
      Add Task
    </Button>
  </DialogActions>
</Dialog>


{/* Display Tasks */}
<Box sx={{ mt: 5, width: '100%' }}>
            {Object.keys(dayColors).map((day) => {
              const dayTasks = tasks.filter((task) => task.day === day);
              if (dayTasks.length === 0) return null;

              return (
                <Box
                  key={day}
                  sx={{
                    backgroundColor: dayColors[day],
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                  }}
                >
           <Typography variant="h6" 
           sx={{ mb: 1, 
                 fontWeight: 'bold', 
                 color: 'black'
            }}>
                    {day}
                  </Typography>
                  {dayTasks.map((task, index) => (
                    <Box
                    key={index}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      p: 2,
                      mb: 1,
                      boxShadow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      position: 'relative',
                      }}
                    >
 {/* Task Name */}
 <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                mt: 2, // Add margin to avoid overlap with the date
                textAlign: 'left',
                width: '100%',
                fontSize: '1.4rem',
              }}
            >
              {task.name}
            </Typography>
            
            
{/* Task Description */}
<Typography
              variant="body2"
              sx={{
                textAlign: 'left',
                width: '100%',
              }}
            >
              {task.description}
            </Typography>              
              
              <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontWeight: 'bold',
                color: 'gray',
              }}
            >
              {new Date(task.date).toLocaleDateString('en-GB')} {/* Format date as dd/mm/yyyy */}
            </Typography>                    
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
                onClick={() => navigate(`/tasks/edit/${task._id}`)}
              >
                <EditIcon/>
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDeleteTask(task._id)}
              >
                <DeleteIcon/>
              </Button>
            </Box>
            
            </Box>
                  ))}
                </Box>
              );
            })}
          </Box>

        </>
      )}    </Box>

</ThemeProvider>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'MUI',
        homeUrl: '/toolpad/core/introduction',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

DashboardLayoutBranding.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
