import { def } from "../utils";
import { Screen } from './app';
import { OptimisticPromise } from '../promisePlus';

export const actionsTemplate = {
    navigateToScreen: def<OptimisticPromise<Screen>>(),
    navigateBack: def(),
};
export type ActionsTemplate = typeof actionsTemplate;
