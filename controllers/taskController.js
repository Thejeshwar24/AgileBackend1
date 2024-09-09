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
        const { userName } = req.query;  // Fetch the userName from the query parameter

        //  Check if the user exists by userName
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with the name "${userName}" not found`
            });
        }

        // Fetch all tasks assigned to the user's ID
        const tasks = await Task.find({ assignedUser: user._id });

        //  If no tasks are assigned, return an appropriate message
        if (tasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No tasks assigned to user "${userName}".`,
                data: []
            });
        }

        //  Return the tasks assigned to the user
        res.status(200).json({
            success: true,
            message: `Tasks assigned to user "${userName}" retrieved successfully.`,
            data: tasks
        });

    } catch (error) {
        next(error);
    }
};



export const getTasksByName = async (req, res) => {
    try {
        const { userName } = req.params; // Fetch the userName from the URL parameter

        // Step 1: Find the user by their name
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ message: `User with name "${userName}" not found` });
        }

        // Step 2: Fetch tasks assigned to the user
        const tasks = await Task.find({ assignedUser: user._id }).populate('storyId');

        // Step 3: Return the tasks, or return a message if no tasks are found
        if (tasks.length === 0) {
            return res.status(200).json({ message: `No tasks found for user "${userName}"`, data: [] });
        }

        res.status(200).json({
            success: true,
            message: `Tasks assigned to user "${userName}" retrieved successfully.`,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};
