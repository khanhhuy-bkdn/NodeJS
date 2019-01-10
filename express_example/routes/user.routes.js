import { Router } from 'express';
import UserController from '../controllers/user.controller';
import validation from '../validation/user';
import validate from 'express-validation';
import * as middleware from '../middleware/authentication'
const router = new Router();

// Get all users
// RestfillAPI
// Get data: method GET
// Create new data: method POST
// Update data: method PUT
// Delete data: method DELETE
// PATCH... Update

// Resfull naming. cach dat ten.

router.get('/users',  middleware.verifyToken, UserController.getAll);
router.get('/users/:id', validate(validation.getUserById), middleware.verifyToken, UserController.getUserById)
router.post('/users', validate(validation.createUser), middleware.verifyToken, UserController.addUser)
router.put('/users/:id', validate(validation.updateUser), middleware.verifyToken, UserController.updateUser)
router.delete('/users/:id', validate(validation.deleteUser), middleware.verifyToken, UserController.deleteUser)
router.post('/login', validate(validation.loginUser), UserController.login)
router.put('/users/:id/updatePassword', validate(validation.updatePassword), middleware.verifyToken, UserController.updatePassword)

export default router;