import mongoose from 'mongoose';


const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    description: String,
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    userGroup: String,
    assignedUser: String,
    priority: String,
    duration: Number,
    estimationPoints: Number,
    startDate: Date,
    endDate: Date,
    status: { 
        type: String, 
        enum: ['Pending', 'In progress', 'Completed'], 
        default: 'Pending' // Default value when a new task is created
    },
    totalHrs: {
        type: Number,
        default: 0 // Default value is 0 when a new task is created
    }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
