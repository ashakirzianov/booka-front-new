import * as React from 'react';

import { Props } from './common';
import { FadeInProps } from './Animations.common';

export function FadeIn({ visible, children }: Props<FadeInProps>) {
    return visible
        ? <>{children}</>
        : null;
}
