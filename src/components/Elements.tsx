import * as React from 'react';
import { Text, View, Link as AtomLink } from './Atoms';
import { Comp, size } from './comp-utils';
import { FlexStyle } from 'react-native';
import { Loading, Loadable, isLoading } from '../model';

export function loadable<T>(Cmp: Comp<T>): Comp<Loadable<T>> {
    return props =>
        isLoading(props) ? <LoadingComp {...props} /> : <Cmp {...props} />;
}

const LoadingComp: Comp<Loading> = props =>
    <TextBlock text='Loading now...' />;

const defaultStyle = {
    fontFamily: 'Georgia',
    color: '#999999',
};
export const TextBlock: Comp<{ text: string }> = props =>
    <Text style={{
        ...defaultStyle,
        fontSize: 20,
        textAlign: 'justify',
    }}>{'\t' /*
            React Native is missing text-indent styling
        */}{props.text}</Text>;

export const LinkButton: Comp<{ to: string, text: string }> = props =>
    <AtomLink to={props.to}>{props.text}</AtomLink>;

export type Align = FlexStyle['alignItems'];
export const Column: Comp<{
    maxWidth?: number,
    margin?: number,
    align?: Align,
    backgroundColor?: string,
}> = props =>
    <View style={{
        flexDirection: 'column',
        maxWidth: size(props.maxWidth),
        alignItems: props.align,
        backgroundColor: props.backgroundColor,
        margin: size(props.margin),
    }}>
        {props.children}
    </View>;

export const Row: Comp = props =>
<View style={{ flexDirection: 'row' }}>{props.children}</View>;

export const ChapterTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ ...defaultStyle, fontSize: 20 }}>{props.text}</Text>
    </View>;

export const PartTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: 24 }}>{props.text}</Text>
    </View>;

export const SubpartTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: 20 }}>{props.text}</Text>
    </View>;

export const BookTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: 28 }}>{props.text}</Text>
    </View>;

export {
    Text,
    Route, Redirect, Switch, Router,
} from './Atoms';
