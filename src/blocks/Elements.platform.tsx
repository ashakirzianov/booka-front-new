import * as React from 'react';

import * as Atoms from './Atoms';
import { themed, comp, relative, hoverable, palette } from './comp-utils';

export const Inline = comp(props =>
    <div style={{ display: 'inline' }}>{props.children}</div>,
);

export const NewLine = comp(props => <br />);

export const Tab = comp(props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>,
);

export const DottedLine = comp(props =>
    <div key='aaa' style={{
        flex: 1,
        borderBottom: 'dotted 0.2em',
    }} />,
);

export const LinkButton = hoverable(themed<Atoms.LinkProps>(props =>
    <Atoms.Link {...props}>
        <div style={{
            border: 'solid',
            borderColor: palette(props).accent,
            color: palette(props).accent,
            fontSize: props.theme.fontSize.normal,
            borderRadius: props.theme.radius,
            padding: relative(0.3), // TODO: extract somewhere ?
            [':hover']: {
                borderColor: palette(props).highlight,
                color: palette(props).highlight,
            },
        }}>
            {props.children}
        </div>
    </Atoms.Link>,
));

export const Clickable = comp<{ onClick: () => void }>(props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>,
);
