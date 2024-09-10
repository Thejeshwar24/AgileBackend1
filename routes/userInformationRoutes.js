import express from 'express';
import { createUserInformation, getUserInformation, getUserInformationById, updateUserInformation, deleteUserInformation }  from '../controllers/UserInformationController.js';
const router = express.Router();

// Route to create new user information
router.post('/', createUserInformation);

// Route to get all user information
router.get('/', getUserInformation);

// Route to get user information by ID
router.get('/:id', getUserInformationById);

// Route to update user information by ID
router.put('/:id', updateUserInformation);

// Route to delete user information by ID
router.delete('/:id', deleteUserInformation);

export default router;
