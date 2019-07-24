import * as React from 'react';
import { Props, point, defaults } from './common';
import { Themeable, themed } from './connect';
import { FadeIn } from './Animations';
import { colors } from '../model';

export type BarProps = {
    open: boolean,
};
function bar(top: boolean) {
    return function Bar(props: Props<Themeable<BarProps>>) {
        return <FadeIn visible={props.open}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: point(defaults.headerHeight),
                position: 'fixed',
                top: top ? 0 : undefined,
                bottom: !top ? 0 : undefined,
                left: 0,
                zIndex: 5,
                boxShadow: `0px 0px 2px ${colors(props.theme).shadow}`,
                backgroundColor: colors(props.theme).secondary,
            }}>
                {props.children}
            </div>
        </FadeIn >;
    };
}

export const TopBar = themed(bar(true));
export const BottomBar = themed(bar(false));
