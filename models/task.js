import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // UUID generator

// Custom function to generate a shorter UUID with a custom prefix
const generateShortUuid = () => {
    const uuid = uuidv4();  // Generate full UUID
    return `task-${uuid.split('-')[0]}`;  // Use only the first part of the UUID
};

// Define the Task schema with the custom shorter ID
const taskSchema = new mongoose.Schema({
    _id: { type: String, default: generateShortUuid },  // Use the shorter UUID generator
    taskName: { type: String, required: true },
    description: String,
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    userGroup: String,
    assignedUser: String,
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    duration: Number,
    estimationPoints: Number,
    startDate: Date,
    endDate: Date,
    status: { 
        type: String, 
        enum: ['Pending', 'In progress', 'Completed'], 
        default: 'Pending'
    },
    totalHrs: {
        type: Number,
        default: 0
    }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
