import { Schema, model, Document } from 'mongoose';
import { BookStatus, BookFormat } from '../models/Book.ts';

export { BookStatus, BookFormat };

export interface IBook extends Document {
    title: string;
    author: string;
    numberOfPages: number;
    status: BookStatus;
    price: number;
    numberOfPagesRead: number;
    format: BookFormat;
    suggestedBy: string;
    finished: boolean;
}

const BookSchema = new Schema<IBook>({
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        trim: true 
    },
    author: { 
        type: String, 
        required: [true, 'Author is required'], 
        trim: true 
    },
    numberOfPages: { 
        type: Number, 
        required: [true, 'Total number of pages is required'], 
        min: [1, 'A book must have at least 1 page'] 
    },
    status: { 
        type: String, 
        enum: Object.values(BookStatus), 
        default: BookStatus.WANT_TO_READ 
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required'], 
        min: [0, 'Price cannot be negative'] 
    },
    numberOfPagesRead: { 
        type: Number, 
        default: 0,
        min: [0, 'Pages read cannot be negative'] 
    },
    format: { 
        type: String, 
        enum: Object.values(BookFormat), 
        required: [true, 'Book format is required'] 
    },
    suggestedBy: { 
        type: String, 
        trim: true 
    },
    finished: { 
        type: Boolean, 
        default: false 
    }
});

BookSchema.pre<IBook>('save', function () {
    if (this.numberOfPagesRead > this.numberOfPages) {
        throw new Error(
            `Pages read (${this.numberOfPagesRead}) cannot exceed the total number of pages (${this.numberOfPages}).`
        );
    }

    if (this.numberOfPagesRead === this.numberOfPages) {
        this.finished = true;
        this.status = BookStatus.READ;
    }
});

// 5. Create and export the Model
const BookModel = model<IBook>('Book', BookSchema);
export default BookModel;