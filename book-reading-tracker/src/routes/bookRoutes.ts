import express from 'express';
import { createBook, deleteBook, listBooks, updatePagesRead, updateStatus } from '../controllers/bookController.ts';

const router = express.Router();

router.get('/getBooks', listBooks);
router.post('/addBook', createBook);
router.patch('/updatePagesRead/:id', updatePagesRead);
router.patch('/updateStatus/:id', updateStatus);
router.delete('/deleteBook/:id', deleteBook);

export default router;