import express from 'express';
import { createBook, deleteBook, listBooks, updatePagesRead } from '../controllers/bookController.ts';

const router = express.Router();

router.get('/getBooks', listBooks);
router.post('/addBook', createBook);
router.patch('/updatePagesRead/:id', updatePagesRead);
router.delete('/deleteBook/:id', deleteBook);

export default router;