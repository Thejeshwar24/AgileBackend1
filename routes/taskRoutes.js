import express from 'express';
import { createTask, getTasks,getTaskById,updateTask,deleteTask,getTasksByUserName } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
//
router.get('/tasks/byUserName', getTasksByUserName);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

//

export default router;
