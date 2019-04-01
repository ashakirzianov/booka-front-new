import {
    readValue,
    // storeValue,
} from './persistentStore.platform';
import { App, libraryScreen, library, Theme } from '../model';

const storeKey = 'state';
export function storeState(state: App) {
    // storeValue(storeKey, state);
}

export function initialState(): App {
    return validateState(restoreState()) || createNewState();
}

function restoreState(): object | undefined {
    return readValue(storeKey);
}

function validateState(restored: object | undefined): App | undefined {
    return undefined; // TODO: implement
}

function createNewState(): App {
    return {
        screen: libraryScreen(library()),
        pathToOpen: null,
        controlsVisible: true,
        theme: defaultTheme,
        syncable: {
            positionStore: {},
        },
    };
}

const defaultTheme: Theme = {
    palettes: {
        light: {
            text: '#000',
            primary: '#fff',
            secondary: '#eee',
            accent: '#777',
            highlight: '#aaf',
            shadow: '#000',
        },
        sepia: {
            text: '#5f3e24',
            primary: '#f9f3e9',
            secondary: '#e6e0d6',
            accent: '#987',
            highlight: '#321',
            shadow: '#000',
        },
        dark: {
            text: '#999',
            primary: '#000',
            secondary: '#222',
            accent: '#ddd',
            highlight: '#fff',
            shadow: '#555',
        },
    },
    currentPalette: 'light',
    fontFamily: 'Georgia',
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    fontScale: 1,
    radius: 9,
};
