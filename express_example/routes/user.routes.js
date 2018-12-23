import { Router } from 'express';
import UserController from '../controllers/user.controller';
const router = new Router();

// Get all users
// RestfillAPI
// Get data: method GET
// Create new data: method POST
// Update data: method PUT
// Delete data: method DELETE
// PATCH... Update

// Resfull naming. cach dat ten.

router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.addUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;