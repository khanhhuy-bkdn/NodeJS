import { Router } from 'express';
import ClassController from '../controllers/class.controller';
const router = new Router();

// Get all users
// RestfillAPI
// Get data: method GET
// Create new data: method POST
// Update data: method PUT
// Delete data: method DELETE
// PATCH... Update

// Resfull naming. cach dat ten.

router.get('/classes', ClassController.getAll);
router.get('/classes/:id', ClassController.getClassById);
router.post('/classes', ClassController.addClass);
router.put('/classes/:id', ClassController.updateClass);
router.delete('/classes/:id', ClassController.deleteClass);

export default router;