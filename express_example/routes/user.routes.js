import { Router } from 'express';
import UserController from '../controllers/user.controller';
import validation from '../validation/user';
import validate from'express-validation';
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
router.get('/users/:id', validate(validation.getUserById), UserController.getUserById);
router.post('/users', validate(validation.createUser), UserController.addUser);
router.put('/users/:id', validate(validation.updateUser), UserController.updateUser);
router.delete('/users/:id', validate(validation.deleteUser), UserController.deleteUser);

export default router;