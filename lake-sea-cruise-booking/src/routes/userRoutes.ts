import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Route to create a new user profile
router.post('/register', userController.register);

// Route to update user profile
router.put('/update/:id', userController.updateProfile);

// Route to get user profile by ID
router.get('/:id', userController.getProfile);

// Route to delete user profile
router.delete('/:id', userController.deleteProfile);

export default router;