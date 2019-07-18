import * as React from 'react';

import {
    Color, BookRange, BookPath, isSimple, Span,
    isCompound, isAttributed, isFootnote,
    pathLessThan, isPrefix, attrs, Theme,
} from '../model';
import {
    RichTextStyle, RichText, Callback, colors,
} from '../blocks';
import {
    assertNever, filterUndefined,
    TaggedRange, range, Range,
} from '../utils';
import { RefPathHandler, pathToId } from './common';

export type ColorizedRange = {
    color: Color,
    range: BookRange,
};
export type Colorization = {
    ranges: ColorizedRange[],
};

export type SpanProps = {
    span: Span,
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
    colorization?: Colorization,
    theme: Theme,
    openFootnote: Callback<string>,
};
export function SpanComp(props: SpanProps) {
    const ranges = rangesForProps(props);
    const fullText = spanText(props.span);
    return <RichText
        text={fullText}
        styles={ranges}
    />;
}

type RenderingRange = TaggedRange<RichTextStyle, number>;
function rangesForProps(props: SpanProps): RenderingRange[] {
    const spanRanges = rangesForSpan(props.span, props);
    const dropCaseRanges = props.first
        ? [{
            range: range(0, 1),
            tag: { dropCaps: true },
        }]
        : [];

    const absoluteRanges = ((props.colorization && props.colorization.ranges) || []);
    const colorizationRanges = filterUndefined(
        absoluteRanges
            .map(cr => {
                const relative = rangeRelativeToPath(props.path, cr.range);
                return relative
                    ? {
                        tag: { background: cr.color },
                        range: relative,
                    }
                    : undefined;
            })
    );

    const defaultStyles: RenderingRange[] = [{
        range: range(0),
        tag: {
            fontSize: props.theme.fontSizes.normal * props.theme.fontScale,
            color: colors(props).text,
        },
    }];

    const allRanges = spanRanges
        .concat(dropCaseRanges)
        .concat(colorizationRanges)
        .concat(defaultStyles)
        ;
    const augmented = allRanges.map(r => {
        const path = props.path.concat(r.range.start);

        return {
            range: r.range,
            tag: {
                ...r.tag,
                id: pathToId(path),
                refHandler: (ref: any) => props.refPathHandler(ref, path),
            },
        };
    });

    return augmented;
}

function rangesForSpan(span: Span, props: SpanProps): RenderingRange[] {
    const result = rangesForSpanHelper(span, 0, props);
    return result.ranges;
}

function rangesForSpanHelper(span: Span, offset: number, props: SpanProps): {
    ranges: RenderingRange[],
    length: number,
} {
    if (isSimple(span)) {
        return {
            ranges: [{
                range: {
                    start: offset,
                    end: offset + span.length,
                },
                tag: undefined,
            }],
            length: span.length,
        };
    } else if (isAttributed(span)) {
        const inside = rangesForSpanHelper(span.content, offset, props);
        const current: RenderingRange = {
            range: {
                start: offset,
                end: offset + inside.length,
            },
            tag: {
                italic: attrs(span).italic,
                bold: attrs(span).bold,
                line: attrs(span).line,
            },
        };
        return {
            ranges: [current].concat(inside.ranges),
            length: inside.length,
        };
    } else if (isCompound(span)) {
        let ranges: RenderingRange[] = [];
        let currentOffset = offset;
        for (const s of span.spans) {
            const rs = rangesForSpanHelper(s, currentOffset, props);
            ranges = ranges.concat(rs.ranges);
            currentOffset += rs.length;
        }

        return {
            ranges,
            length: currentOffset - offset,
        };
    } else if (isFootnote(span)) {
        const inside = rangesForSpanHelper(span.content, offset, props);
        const current: RenderingRange = {
            range: {
                start: offset,
                end: offset + inside.length,
            },
            tag: {
                superLink: {
                    onClick: () => props.openFootnote(span.id),
                },
                color: colors(props).accent,
            },
        };
        return {
            ranges: [current].concat(inside.ranges),
            length: inside.length,
        };
    } else {
        return assertNever(span);
    }
}

function rangeRelativeToPath(path: BookPath, bookR: BookRange): Range<number> | undefined {
    if (bookR.end && pathLessThan(bookR.end, path)) {
        return undefined;
    }

    if (!pathLessThan(path, bookR.start)) {
        return range(0);
    }

    let start: number | undefined;
    if (isPrefix(path, bookR.start)) {
        start = bookR.start[path.length];
    }
    let end: number | undefined;
    if (bookR.end && isPrefix(path, bookR.end)) {
        end = bookR.end[path.length];
    }

    return start !== undefined
        ? range(start, end)
        : undefined;
}

// TODO: move to model utils
function spanText(span: Span): string {
    if (isSimple(span)) {
        return span;
    } else if (isAttributed(span)) {
        return spanText(span.content);
    } else if (isCompound(span)) {
        return span.spans
            .map(spanText)
            .join('');
    } else if (isFootnote(span)) {
        return spanText(span.content);
    }

    return assertNever(span);
}