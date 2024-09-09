import express from 'express';
import { createUser, getUsers,checkUserExists,updateUser,deleteUser} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
//
// router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.get('/check/:userName', checkUserExists);
// router.get('/search/:name', getUsersByName);
// router.get('/:userName/assignments', getUserDetailsWithAssignmentsByName);
router.delete('/:id', deleteUser);



export default router;
