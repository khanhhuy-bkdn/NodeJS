import { Router } from 'express';
import UserController from '../controllers/user.controller';
import validation from '../validation/user';
import validate from 'express-validation';
import * as middleware from '../middleware/authentication'
import { apiLimiter } from '../validation/limit'
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
router.post('/upload', apiLimiter, UserController.upload)
router.post('/send-mail', validate(validation.sendMail), UserController.sendMail)
router.post('/reset-password', validate(validation.resetPassword), middleware.verifyTokenForgotPassword, UserController.resetPassword)
router.post('/reset-password-2', validate(validation.resetPassword), UserController.resetPassword2)

export default router;