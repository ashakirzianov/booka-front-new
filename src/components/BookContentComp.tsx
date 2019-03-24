import * as React from 'react';
import { throttle } from 'lodash';
import {
    Span, BookPath, ChapterNode, BookId, bookLocator, BookRange, BookNode, isParagraph,
    isChapter, inRange, BookContent, subpathCouldBeInRange, AttributesObject,
    SimpleSpan, AttributedSpan, attrs, isAttributed, isSimple, ParagraphNode,
} from '../model';
import { linkForBook } from '../logic';
import { assertNever } from '../utils';
import { Comp, Callback, relative } from './comp-utils';
import { Row, StyledText, LinkButton, Label, ScrollView, IncrementalLoad } from './Elements';
import { refable, RefType, isPartiallyVisible, scrollToRef } from './Scroll.platform';
import { Text, Div, Tab, NewLine } from './Atoms';

const ChapterTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText>{props.text}</StyledText>
    </Row>;

const PartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText style={{ fontWeight: 'bold', fontSize: 30 }}>{props.text}</StyledText>
    </Row>;

const SubpartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <StyledText style={{ fontWeight: 'bold' }}>{props.text}</StyledText>
    </Row>;

const BookTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <StyledText style={{ fontWeight: 'bold', fontSize: 36 }}>{props.text}</StyledText>
    </Row>;

const StyledWithAttributes: Comp<{ attrs: AttributesObject }> = (props =>
    <Text style={{
        fontStyle: props.attrs.italic ? 'italic' : undefined,
    }}>
        {props.children}
        {
            props.attrs.line
                ? [<NewLine key='nl' />, <Tab key='tab' />]
                : null
        }
    </Text>);

const SimpleSpanComp: Comp<{ p: SimpleSpan }> = (props =>
    <StyledText>{props.p}</StyledText>
);
const AttributedSpanComp: Comp<{ p: AttributedSpan }> = (props =>
    <StyledWithAttributes attrs={attrs(props.p)}>
        {
            props.p.spans.map((childP, idx) =>
                <SpanComp key={`${idx}`} span={childP} />)
        }
    </StyledWithAttributes>
);
const SpanComp: Comp<{ span: Span }> = (props =>
    isAttributed(props.span) ? <AttributedSpanComp p={props.span} />
        : isSimple(props.span) ? <SimpleSpanComp p={props.span} />
            : assertNever(props.span)
);

const ParagraphComp = refable<{ p: ParagraphNode, path: BookPath }>(props =>
    <Div>
        <Tab /><SpanComp span={props.p.span} />
    </Div>,
);

const ChapterHeader = refable<ChapterNode & { path: BookPath }>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
);

const PathLink: Comp<{ path: BookPath, id: BookId, text: string }> = (props =>
    <Row style={{
        justifyContent: 'center',
        margin: relative(2),
    }}>
        <LinkButton borders link={linkForBook(bookLocator(props.id, props.path))}>
            <Label text={props.text} />
        </LinkButton>
    </Row>
);

type RefMap = { [k in string]?: RefType };
type BookContentCompProps = {
    content: BookContent,
    pathToNavigate: BookPath | null,
    updateCurrentBookPosition: Callback<BookPath>,
    range: BookRange,
    prevPath?: BookPath,
    nextPath?: BookPath,
    id: BookId,
};
export class BookContentComp extends React.Component<BookContentCompProps> {
    public refMap: RefMap = {};

    public handleScroll = throttle(() => {
        const newCurrentPath = Object.entries(this.refMap)
            .reduce<BookPath | undefined>((path, [key, ref]) =>
                path || !isPartiallyVisible(ref) ? path : stringToPath(key), undefined);
        if (newCurrentPath) {
            this.props.updateCurrentBookPosition(newCurrentPath);
        }
    }, 250);

    public scrollToCurrentPath = () => {
        const props = this.props;
        const refMap = this.refMap;
        if (props && props.pathToNavigate) {
            const refToNavigate = refMap[pathToString(props.pathToNavigate)];
            if (!scrollToRef(refToNavigate)) {
                setTimeout(this.scrollToCurrentPath.bind(this), 250);
            }
        }
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.scrollToCurrentPath();
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    public render() {
        const { range, prevPath, nextPath, id, content } = this.props;
        const params: Params = {
            range, refHandler: (ref, path) => {
                this.refMap = {
                    ...this.refMap,
                    [pathToString(path)]: ref,
                };
            },
        };
        return <ScrollView>
            {prevPath && <PathLink path={prevPath} id={id} text='Previous' />}
            <IncrementalLoad
                increment={250}
                initial={50}
            >
                {buildBook(content, params)}
            </IncrementalLoad>
            {nextPath && <PathLink path={nextPath} id={id} text='Next' />}
        </ScrollView>;
    }
}

type Params = {
    refHandler: (ref: RefType, path: BookPath) => void,
    range: BookRange,
};

function buildBook(book: BookContent, params: Params) {
    const head = params.range.start.length === 0
        ? [<BookTitle key={`bt`} text={book.meta.title} />]
        : [];
    return head
        .concat(buildNodes(book.nodes, [], params));
}

function buildNodes(nodes: BookNode[], headPath: BookPath, params: Params): JSX.Element[] {
    return nodes
        .map((bn, i) => buildNode(bn, headPath.concat([i]), params))
        .reduce((acc, arr) => acc.concat(arr))
        ;
}

function buildNode(node: BookNode, path: BookPath, params: Params) {
    if (!subpathCouldBeInRange(path, params.range)) {
        return [];
    }

    if (isParagraph(node)) {
        return buildParagraph(node, path, params);
    } else if (isChapter(node)) {
        return buildChapter(node, path, params);
    } else {
        return assertNever(node, path.toString());
    }
}

function buildParagraph(paragraph: ParagraphNode, path: BookPath, params: Params) {
    return inRange(path, params.range)
        ? [<ParagraphComp key={`p-${pathToString(path)}`} p={paragraph} path={path} ref={ref => params.refHandler(ref, path)} />]
        : [];
}

function buildChapter(chapter: ChapterNode, path: BookPath, params: Params) {
    const head = inRange(path, params.range)
        ? [<ChapterHeader ref={ref => params.refHandler(ref, path)} key={`ch-${pathToString(path)}`} path={path} {...chapter} />]
        : [];
    return head
        .concat(buildNodes(chapter.nodes, path, params));
}

function pathToString(path: BookPath): string {
    return path.join('-');
}

function stringToPath(str: string): BookPath {
    const path = str.split('-')
        .map(p => parseInt(p, 10));

    return path;
}
