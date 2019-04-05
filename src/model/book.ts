import { BookId } from './bookLocator';
import { BookContent } from './bookContent';
import { TableOfContents } from './tableOfContent';

export type ErrorBook = {
    book: 'error',
    id: BookId,
    error: string,
};

export type LoadingBook = {
    book: 'loading',
    id: BookId,
};

export type LoadedBook = {
    book: 'book',
    id: BookId,
    toc: TableOfContents,
    content: BookContent,
};

export type Book = LoadedBook | ErrorBook | LoadingBook;

export function loadingBook(id: BookId): LoadingBook {
    return {
        book: 'loading',
        id,
    };
}
