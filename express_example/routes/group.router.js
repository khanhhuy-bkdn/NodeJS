import { Router } from 'express';
import GroupController from '../controllers/Group.controller';
import validation from '../validation/group';
import validate from'express-validation';
const router = new Router();

router.get('/groups', GroupController.getAll);
router.get('/groups/:id', validate(validation.getGroupById), GroupController.getGroupById);
router.post('/groups', validate(validation.createGroup), GroupController.addGroup);
router.put('/groups/:id', validate(validation.updateGroup), GroupController.updateGroup);
router.delete('/groups/:id', validate(validation.deleteGroup), GroupController.deleteGroup);

export default router;