
import Task from '../models/task.js';

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


export const getTasksByUserNameWithStatus = async (req, res) => {
    try {
        const { userName } = req.query;  // Fetch userName from query parameters

        // Define priority mapping if necessary (only if priority is stored as string)
        const priorityOrder = {
            'High': 1,
            'Medium': 2,
            'Low': 3
        };

        // Fetch all tasks assigned to the user
        const allTasks = await Task.find({
            assignedUser: userName  // Fetch tasks assigned to the user
        });

        // If no tasks are assigned to the user
        if (allTasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No tasks assigned to user "${userName}".`,
                total_tasks: 0,
                pending_in_progress_tasks: 0,
                tasks: []
            });
        }

        // Fetch tasks assigned to the user that are NOT completed
        const tasks = await Task.find({
            assignedUser: userName,  // Assigned to the user
            status: { $ne: 'Completed' }  // Exclude tasks with 'Completed' status
        })
        .select('taskName description priority startDate endDate status')  // Only fetch specific fields
        .sort({ priority: 1 });  // Sort tasks by priority (highest first)

        // Check if there are tasks that are pending or in progress
        if (tasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: `User "${userName}" has no pending or in-progress tasks.`,
                total_tasks: allTasks.length,  // Total tasks assigned to the user
                pending_in_progress_tasks: 0,  // Tasks that are not completed
                tasks: []
            });
        }

        // Return the tasks with a message indicating total task count and non-completed task count
        res.status(200).json({
            success: true,
            message: `User "${userName}" has ${tasks.length} pending or in-progress tasks out of ${allTasks.length} total tasks assigned.`,
            total_tasks: allTasks.length,  // Total tasks assigned to the user
            pending_in_progress_tasks: tasks.length,  // Tasks that are not completed
            tasks: tasks
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};



