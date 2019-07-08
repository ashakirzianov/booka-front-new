import * as React from 'react';

import { themed, Comp, Props, colors, point } from './common';
import { ActionButton, PlainText, ThemedText, PanelButton } from './Elements';
import { View, SafeAreaView, TouchableWithoutFeedback, Modal as NativeModal } from 'react-native';
import {
    ModalProps, WithPopoverProps, BarProps,
    OverlayBoxProps, ClickableProps, LinkButtonProps,
} from './Complex.common';
import { FadeIn } from './Animations.native';
import { Column, Row } from './Atoms.common';

export { Layer } from './Complex.common';

// TODO: implement components below

export function Modal({ open, title, toggle, children }: Props<ModalProps>) {
    return <NativeModal
        visible={open}
        animationType='slide'
        onRequestClose={toggle}
    >
        <SafeAreaView>
            <Column>
                <Row style={{ justifyContent: 'center' }}>
                    <Column style={{
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 0,
                    }}>
                        <PanelButton
                            onClick={toggle}
                            icon='close'
                        />
                    </Column>
                    <ThemedText size='normal'>{title}</ThemedText>
                </Row>
                <Row>{children}</Row>
            </Column>
        </SafeAreaView>
    </NativeModal>;
}

const viewOffset = 3.5;
export const headerHeight = 3.5;
function bar(top: boolean) {
    return themed<BarProps>(props =>
        <FadeIn visible={props.open}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: point(headerHeight + viewOffset),
                position: 'absolute',
                top: top ? 0 : undefined,
                bottom: !top ? 0 : undefined,
                left: 0,
                zIndex: 5,
                backgroundColor: colors(props).secondary,
            }}>
                <SafeAreaView>
                    {props.children}
                </SafeAreaView>
            </View >
        </FadeIn>
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
        const { children } = this.props;
        return <View>
            {children(this.toggleVisibility.bind(this))}
        </View>;
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

export const LinkButton = themed<LinkButtonProps>(props =>
    <ActionButton {...props}>
        <View style={{
            borderWidth: 2,
            borderStyle: 'solid',
            borderRadius: 10,
            borderColor: colors(props).accent,
            padding: point(1),
        }}>
            <PlainText style={{
                fontSize: props.theme.fontSizes.normal,
                color: colors(props).accent,
            }}>
                {props.text}
            </PlainText>
        </View>
    </ActionButton>
);

export const Clickable: Comp<ClickableProps> = (props =>
    <TouchableWithoutFeedback
        onPress={props.onClick}
    >
        <View>
            {props.children}
        </View>
    </TouchableWithoutFeedback>
);

export const OverlayBox = themed<OverlayBoxProps>(props =>
    <View>{props.children}</View>
);
