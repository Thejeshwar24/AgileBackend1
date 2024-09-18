import express from 'express';
import { createUser, getUsers,checkUserExists,updateUser,deleteUser,getUserByWhatsappNumber} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/by_number', getUserByWhatsappNumber);
router.get('/check', checkUserExists);



export default router;
