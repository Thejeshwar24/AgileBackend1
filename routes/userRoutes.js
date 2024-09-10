import express from 'express';
import { createUser, getUsers,checkUserExists,updateUser,deleteUser} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.get('/check', checkUserExists);
router.delete('/:id', deleteUser);



export default router;
