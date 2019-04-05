export type RemoteBookId = {
    bi: 'remote-book',
    name: string,
};
export type BookId = RemoteBookId;
export function sameId(bi1: BookId, bi2: BookId): boolean {
    return bi1.bi === 'remote-book'
        ? bi2.bi === 'remote-book' && bi2.name === bi1.name
        : false;
}

export function remoteBookId(name: string): RemoteBookId {
    return {
        bi: 'remote-book',
        name: name,
    };
}

export type BookPath = number[];

export function emptyPath(): BookPath {
    return [];
}

export function pathHead(path: BookPath): number | undefined {
    return path[0];
}

export function pathTail(path: BookPath) {
    return path.slice(1);
}

export function appendPath(path: BookPath, last: number): BookPath {
    return path.concat([last]);
}

export function samePath(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx])
        ;
}

export function pathLessThan(left: BookPath, right: BookPath): boolean {
    for (let idx = 0; idx < right.length; idx++) {
        const leftElement = left[idx];
        if (leftElement === undefined) {
            return true;
        }
        const rightElement = right[idx];
        if (leftElement !== rightElement) {
            return leftElement < rightElement;
        }
    }

    return false;
}

export type BookRange = {
    start: BookPath,
    end?: BookPath,
};

export function bookRange(start?: BookPath, end?: BookPath): BookRange {
    return {
        start: start || [],
        end: end,
    };
}

export function inRange(path: BookPath, range: BookRange): boolean {
    if (pathLessThan(path, range.start)) {
        return false;
    }
    if (range.end && !pathLessThan(path, range.end)) {
        return false;
    }

    return true;
}

export function subpathCouldBeInRange(path: BookPath, range: BookRange): boolean {
    if (range.end && !pathLessThan(path, range.end)) {
        return false;
    }

    const part = range.start.slice(0, path.length);
    const could = !pathLessThan(path, part);
    return could;
}

export type BookLocator = {
    id: BookId,
    path: BookPath,
};

export function bookLocator(id: BookId, path?: BookPath): BookLocator {
    return {
        id: id,
        path: path || emptyPath(),
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return sameId(bl1.id, bl2.id);
}

export function updatePath(bl: BookLocator, path: BookPath): BookLocator {
    return {
        ...bl,
        path: path,
    };
}

export function stringToBL(str: string): BookLocator | undefined {
    const matches = str.match(/([\w-]+)(\/((\d+-?)+))?/);
    if (!matches) {
        return undefined;
    }
    const bookName = matches[1];
    const pathString = matches[3];
    if (pathString) {
        const path = pathString
            .split('-')
            .map(pc => parseInt(pc, 10))
            ;
        return bookLocator(remoteBookId(bookName), path);
    }

    return bookLocator(remoteBookId(bookName));
}

export function blToString(bl: BookLocator): string {
    return `${biToString(bl.id)}/${pathToString(bl.path)}`;
}

export function biToString(bi: BookId): string {
    return bi.bi === 'remote-book'
        ? bi.name
        : '@not-a-book'; // TODO: better solution
}

export function rangeToString(br: BookRange): string {
    return `${pathToString(br.start)}${br.end ? ':' + pathToString(br.end) : ''}`;
}

export function pathToString(path: BookPath | undefined): string {
    return path === undefined || path.length === 0 || (path.length === 1 && path[0] === 0)
        ? ''
        : `${path.join('-')}`
        ;
}
