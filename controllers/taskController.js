import Task from '../models/task.js';
import User from '../models/user.js';


const taskIndexTracker = {};
const callCounterTracker = {}; 


export const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).send(tasks);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Get a specific Task by ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('storyId');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
};

// Update a Task by ID
export const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

// Delete a Task by ID
export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};



//
export const getTasksByUserName = async (req, res, next) => {
    try {
        const { userName } = req.query;  // Fetch userName from query parameters

        // Check if the user exists by userName
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with the name "${userName}" not found`
            });
        }

        // Fetch tasks assigned to the user that are either pending or in-progress
        const tasks = await Task.find({ 
            assignedUser: user.name, 
            status: { $in: ['Pending', 'In progress'] }  // Fetch only tasks with 'Pending' or 'In progress' status
        }).select('taskName description priority startDate endDate status'); // Only fetch specific fields

        // Check if there are tasks (either pending or in-progress)
        if (tasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No pending or in-progress tasks assigned to user "${userName}".`,
                total_tasks: 0,
                data: []
            });
        }

        // Initialize task index and call counter for this user if not already tracked
        if (!taskIndexTracker[userName]) {
            taskIndexTracker[userName] = 0;
        }
        if (!callCounterTracker[userName]) {
            callCounterTracker[userName] = 0;
        }

        // Check if the API has been called 5 times for this user
        if (callCounterTracker[userName] >= 5) {
            // Reset the counters after reaching 5 calls
            taskIndexTracker[userName] = 0;  // Reset task index
            callCounterTracker[userName] = 0;  // Reset call counter

            return res.status(200).json({
                success: true,
                message: `You have reached the maximum of 5 task retrievals for user "${userName}". No more tasks will be shown. Counters have been reset.`,
                data: []
            });
        }

        // Get the current task index
        let currentIndex = taskIndexTracker[userName];

        // If the current index is greater than or equal to the number of tasks, return a message that all tasks have been displayed and reset the counter
        if (currentIndex >= tasks.length) {
            // Reset the task index for the user to allow restarting
            taskIndexTracker[userName] = 0;

            return res.status(200).json({
                success: true,
                message: `All pending or in-progress tasks have been displayed for user "${userName}".`,
                total_tasks: tasks.length,
                data: []  // No tasks are returned because all have been displayed
            });
        }

        // Fetch the task at the current index
        const task = tasks[currentIndex];

        // Increment the task index and call counter for the next API call
        taskIndexTracker[userName]++;
        callCounterTracker[userName]++;

        // Return the task with a message indicating the total number of tasks
        res.status(200).json({
            success: true,
            message: `Task ${currentIndex + 1} of ${tasks.length} pending or in-progress tasks assigned to user "${userName}" retrieved successfully.`,
            total_tasks: tasks.length,  // Show how many pending/in-progress tasks the user has
            data: task
        });

    } catch (error) {
        next(error);
    }
};




export const updateTaskStatusAndHours = async (req, res) => {
    try {
        const { id } = req.params;  // Task ID from the URL
        const { status, totalHrs } = req.body;  // Fields to be updated

        // Find the task by ID and update the status and total hours
        const updatedTask = await Task.findByIdAndUpdate(
            id, 
            { 
                status: status || 'pending',  // Update status, default to pending if not provided
                totalHrs: totalHrs || 0       // Update total hours, default to 0 if not provided
            }, 
            { new: true, runValidators: true }  // Return the updated document and validate the data
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error: error.message });
    }
};



