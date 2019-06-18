import * as React from 'react';
import { themed, Comp, Props } from './comp-utils';
import { ActionLinkProps } from './Elements';
import { View } from 'react-native';
import {
    ModalProps, WithPopoverProps, BarProps,
    OverlayBoxProps, ClickableProps,
} from './Complex.common';

export { Layer } from './Complex.common';

// TODO: implement components below

export function Modal(props: Props<ModalProps>) {
    return <View>
        {props.children}
    </View>;
}

function bar(top: boolean) {
    return themed<BarProps>(props =>
        <View>
            {props.children}
        </View>
    );
}

export const TopBar = bar(true);
export const BottomBar = bar(false);

type WithPopoverState = {
    open: boolean,
};
export class WithPopover extends React.Component<WithPopoverProps, WithPopoverState> {
    public state = { open: false };

    public toggleVisibility() {
        this.setState({ open: !this.state.open });
    }

    public hide() {
        this.setState({ open: false });
    }

    public render() {
        const props = this.props;
        return <View>{props.children}</View>;
    }
}

export const Tab: Comp = (props =>
    null
);

export const NewLine: Comp = (props => null);
export const DottedLine: Comp = (props =>
    <View />
);
export const Separator: Comp = (() =>
    <View />
);

export const LinkButton = themed<ActionLinkProps>(props =>
    <View>{props.children}</View>
);

export const Clickable: Comp<ClickableProps> = (props =>
    <View>{props.children}</View>
);

export const OverlayBox = themed<OverlayBoxProps>(props =>
    <View>{props.children}</View>
);
