import Task from '../models/task.js';
import User from '../models/user.js';

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
        const { userName, limit } = req.query;  // Fetch userName and limit from query parameters

        // Check if the user exists by userName
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with the name "${userName}" not found`
            });
        }
        const taskLimit = parseInt(limit) > 0 ? parseInt(limit) : 5;

        // Fetch tasks assigned to the user's ID, limiting the results
        const tasks = await Task.find({ assignedUser: user.name }).limit(taskLimit);
        if (tasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No tasks assigned to user "${userName}".`,
                data: []
            });
        }
        res.status(200).json({
            success: true,
            message: `Tasks assigned to user "${userName}" retrieved successfully.`,
            data: tasks
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



