import { remoteBookLocator } from '../model';
import { api } from '../api';
import { Action, actionCreators, dispatchAction } from './store';


export type Destination = string;
export function destinationToActions(dest: Destination): Action[] {
    const bookRouteMatch = dest.match(/^\/book\/(\w+)/);
    if (bookRouteMatch) {
        const bookName = bookRouteMatch[1];
        const bl = remoteBookLocator(bookName);
        return [
            actionCreators.navigateToScreen(api.bookScreen(bl)),
        ];
    }

    if (dest === '/') {
        return [
            actionCreators.navigateToScreen(api.libraryScreen()),
        ];
    }

    return [];
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => dispatchAction(a));
}
