import { Router } from 'express';
import messageController from '../controllers/message.controller';
import validation from '../validation/message';
import validate from'express-validation';
import * as middleware from './../middleware/authentication'
const router = new Router();

router.get('/messages',validate(validation.getAllMessage), middleware.verifyToken, messageController.getAll);
router.get('/messages/:id', validate(validation.getMessageById), middleware.verifyToken, messageController.getMessageById);
router.post('/messages', validate(validation.createMessage), middleware.verifyToken, messageController.addMessage);
router.put('/messages/:id', validate(validation.updateMessage), middleware.verifyToken, messageController.updateMessage);
router.delete('/messages/:id', validate(validation.deleteMessage), middleware.verifyToken, messageController.deleteMessage);

export default router;