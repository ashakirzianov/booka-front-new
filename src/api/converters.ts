import * as Contracts from '../contracts';
import { Library, BookId, LoadedBook, tocFromContent } from '../model';

export function convertLibrary(lib: Contracts.Library): Library {
    return {
        books: lib,
    };
}

export function convertBook(book: Contracts.BookContent, id: BookId): LoadedBook {
    return {
        book: 'book',
        content: book,
        id,
        toc: tocFromContent(book, id),
    };
}
