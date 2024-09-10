import express from 'express';
import { createTask, getTasks,getTaskById,updateTask,deleteTask,getTasksByUserName,updateTaskStatusAndHours } from '../controllers/taskController.js';

const router = express.Router();
router.get('/byUserName', getTasksByUserName);
router.put('/tasks/:id', updateTaskStatusAndHours);



router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);



export default router;
