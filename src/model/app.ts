import { ScreenStack } from './screen';
import { BookPath } from './bookLocator';

export type App = {
    screenStack: ScreenStack,
    currentBookPosition: BookPath,
    positionToNavigate: BookPath | null,
};
