import * as React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { assertNever } from '../utils';
import { IconProps, IconName } from './Icons';

function convertIconName(name: IconName): string {
    switch (name) {
        case 'close':
            return 'times';
        case 'left':
            return 'angle-left';
        case 'items':
            return 'bars';
        case 'letter':
            return 'font';
        case 'sign-in':
            return 'sign-in-alt';
        case 'circle':
            return 'circle';
        case 'facebook':
            return 'facebook-square';
        case 'upload':
            return 'cloud-upload-alt';
        default:
            return assertNever(name);
    }
}

export function Icon({ name, size }: IconProps) {
    return <FontAwesome
        name={convertIconName(name)}
    />;
}
