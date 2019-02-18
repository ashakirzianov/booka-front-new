export type RemoteBookLocator = {
    bl: 'remote-book',
    name: string,
    path: BookPath,
};
export type BookPath = number[];
export function appendPath(head: number, tail: BookPath): BookPath {
    return [head].concat(tail);
}

export function emptyPath(): BookPath {
    return [];
}

export function samePath(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx])
        ;
}

export type BookLocator = RemoteBookLocator;

export function remoteBookLocator(name: string, path?: BookPath): RemoteBookLocator {
    return {
        bl: 'remote-book',
        name: name,
        path: path || [],
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return bl1.bl === bl2.bl && bl1.name === bl2.name;
}

export function updatePath(bl: BookLocator, path: BookPath): BookLocator {
    return {
        ...bl,
        path: path,
    };
}
