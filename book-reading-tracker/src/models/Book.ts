export enum BookStatus {
    READ = 'Read',
    RE_READ = 'Re-read',
    DNF = 'DNF',
    CURRENTLY_READING = 'Currently reading',
    RETURNED_UNREAD = 'Returned Unread',
    WANT_TO_READ = 'Want to read'
}

export enum BookFormat {
    PRINT = 'Print',
    PDF = 'PDF',
    EBOOK = 'Ebook',
    AUDIOBOOK = 'AudioBook'
}

export default class Book {
    public title: string;
    public author: string;
    public numberOfPages: number;
    public status: BookStatus;
    public price: number;
    private _numberOfPagesRead: number = 0;
    public format: BookFormat;
    public suggestedBy: string;
    public finished: boolean = false;

    constructor(
        title: string,
        author: string,
        numberOfPages: number,
        status: BookStatus,
        price: number,
        numberOfPagesRead: number,
        format: BookFormat,
        suggestedBy: string,
    ) {
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
        this.status = status;
        this.price = price;
        this.format = format;
        this.suggestedBy = suggestedBy;
        this.numberOfPagesRead = numberOfPagesRead;
    }

    public get numberOfPagesRead(): number {
        return this._numberOfPagesRead;
    }

    public set numberOfPagesRead(value: number) {
        if (value < 0) {
            throw new Error("Pages read cannot be negative.");
        }
        if (value > this.numberOfPages) {
            throw new Error(`Pages read (${value}) cannot exceed the total number of pages (${this.numberOfPages}).`);
        }
        this._numberOfPagesRead = value;
        
        if (this._numberOfPagesRead === this.numberOfPages) {
            this.finished = true;
            this.status = BookStatus.READ;
        }
    }

    public currentlyAt(): number {
        if (this.numberOfPages === 0) {
            return 0;
        }
        return Math.round((this._numberOfPagesRead / this.numberOfPages) * 100);
    }

    public deleteBook(): void {
        this.title = '';
        this.author = '';
        this.numberOfPages = 0;
        this.status = BookStatus.WANT_TO_READ;
        this.price = 0;
        this._numberOfPagesRead = 0;
        this.format = BookFormat.PRINT;
        this.suggestedBy = '';
        this.finished = false;
    }
}
