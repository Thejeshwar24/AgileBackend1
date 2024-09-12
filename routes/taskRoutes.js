import express from 'express';
import { createTask, getTasks,getTaskById,updateTask,deleteTask,updateTaskStatusAndHours,getTasksByUserNameWithStatus } from '../controllers/taskController.js';

const router = express.Router();
router.get('/byUserName', getTasksByUserNameWithStatus);
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id', updateTaskStatusAndHours);



export default router;
