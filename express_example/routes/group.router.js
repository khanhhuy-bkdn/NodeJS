import { Router } from 'express';
import GroupController from '../controllers/Group.controller';
import validation from '../validation/group';
import validate from'express-validation';
import * as middleware from './../middleware/authentication'
const router = new Router();

router.get('/groups',validate(validation.getAllGroup), middleware.verifyToken, GroupController.getAll);
router.get('/groups/:id', validate(validation.getGroupById), middleware.verifyToken, GroupController.getGroupById);
router.post('/groups', validate(validation.createGroup), middleware.verifyToken, GroupController.addGroup);
router.put('/groups/:id', validate(validation.updateGroup), middleware.verifyToken, GroupController.updateGroup);
router.delete('/groups/:id', validate(validation.deleteGroup), middleware.verifyToken, GroupController.deleteGroup);
router.post('/groups/:id/members', validate(validation.addMemberGroup), middleware.verifyToken, GroupController.addMemberGroup);
router.delete('/groups/:id/members/:idmember', validate(validation.deleteMemberGroup), middleware.verifyToken, GroupController.deleteMemberGroup);

export default router;