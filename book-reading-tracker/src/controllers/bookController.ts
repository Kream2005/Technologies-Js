import type { Request, Response } from 'express';
import Book, { BookStatus, BookFormat } from '../models/Book.ts';
import BookModel from '../schemas/Book.ts';

function toBookInstance(data: {
	title: string;
	author: string;
	numberOfPages: number;
	status: BookStatus;
	price: number;
	numberOfPagesRead: number;
	format: BookFormat;
	suggestedBy: string;
}): Book {
	return new Book(
		data.title,
		data.author,
		data.numberOfPages,
		data.status,
		data.price,
		data.numberOfPagesRead,
		data.format,
		data.suggestedBy
	);
}

export async function listBooks(_req: Request, res: Response) {
	try {
		const books = await BookModel.find();
		res.status(200).json(books);
	} catch {
		res.status(500).json({ message: 'Failed to fetch books.' });
	}
}

export async function createBook(req: Request, res: Response) {
	try {
		const {
			title,
			author,
			numberOfPages,
			status,
			price,
			numberOfPagesRead,
			format,
			suggestedBy
		} = req.body;

		const book = toBookInstance({
			title: String(title),
			author: String(author),
			numberOfPages: Number(numberOfPages),
			status: status as BookStatus,
			price: Number(price),
			numberOfPagesRead: Number(numberOfPagesRead ?? 0),
			format: format as BookFormat,
			suggestedBy: String(suggestedBy)
		});

		const saved = await BookModel.create({
			title: book.title,
			author: book.author,
			numberOfPages: book.numberOfPages,
			status: book.status,
			price: book.price,
			numberOfPagesRead: book.numberOfPagesRead,
			format: book.format,
			suggestedBy: book.suggestedBy,
			finished: book.finished
		});

		res.status(201).json(saved);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to create book.';
		res.status(400).json({ message });
	}
}

export async function updatePagesRead(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { numberOfPagesRead } = req.body;

		if (typeof numberOfPagesRead !== 'number') {
			return res.status(400).json({ message: 'numberOfPagesRead must be a number.' });
		}

		const doc = await BookModel.findById(id);
		if (!doc) {
			return res.status(404).json({ message: 'Book not found.' });
		}

		const book = toBookInstance({
			title: doc.title,
			author: doc.author,
			numberOfPages: doc.numberOfPages,
			status: doc.status,
			price: doc.price,
			numberOfPagesRead: 0,
			format: doc.format,
			suggestedBy: doc.suggestedBy
		});
		book.numberOfPagesRead = numberOfPagesRead;

		doc.numberOfPagesRead = book.numberOfPagesRead;
		doc.finished = book.finished;
		doc.status = book.status;
		await doc.save();

		res.status(200).json(doc);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update pages read.';
		res.status(400).json({ message });
	}
}

export async function updateStatus(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!status || !Object.values(BookStatus).includes(status as BookStatus)) {
			return res.status(400).json({ message: 'Invalid status.' });
		}

		const doc = await BookModel.findById(id);
		if (!doc) {
			return res.status(404).json({ message: 'Book not found.' });
		}

		const update: {
			status: BookStatus;
			numberOfPagesRead?: number;
			finished: boolean;
		} = {
			status: status as BookStatus,
			finished: status === BookStatus.READ
		};

		if (status === BookStatus.READ) {
			update.numberOfPagesRead = doc.numberOfPages;
			update.finished = true;
		} else {
			update.finished = doc.numberOfPagesRead >= doc.numberOfPages;
		}

		const updated = await BookModel.findByIdAndUpdate(id, update, {
			new: true,
			runValidators: true
		});

		res.status(200).json(updated);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update status.';
		res.status(400).json({ message });
	}
}

export async function deleteBook(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const doc = await BookModel.findById(id);
		if (!doc) {
			return res.status(404).json({ message: 'Book not found.' });
		}

		const book = toBookInstance({
			title: doc.title,
			author: doc.author,
			numberOfPages: doc.numberOfPages,
			status: doc.status,
			price: doc.price,
			numberOfPagesRead: doc.numberOfPagesRead,
			format: doc.format,
			suggestedBy: doc.suggestedBy
		});
		book.deleteBook();
		await BookModel.findByIdAndDelete(id);

		res.status(200).json({ message: 'Book deleted.' });
	} catch {
		res.status(400).json({ message: 'Failed to delete book.' });
	}
}
