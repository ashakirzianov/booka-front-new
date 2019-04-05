import * as React from 'react';

import { Library, BookInfo, remoteBookId, locationCurrent, bookLocator } from '../model';
import { comp, Row, Link, SafeAreaView, Column, ThemedText } from '../blocks';
import { actionCreators } from '../redux/actions';

const BookMetaComp = comp<{ meta: BookInfo, id: string }>(props =>
    <Row>
        <Link action={actionCreators.navigateToBook(bookLocator(remoteBookId(props.id), locationCurrent()))}>
            <ThemedText>{props.meta.title}</ThemedText>
        </Link>
    </Row>,
);

export const LibraryComp = comp<Library>(props =>
    <SafeAreaView>
        <Column>
            {
                Object.keys(props.books).map(
                    id => <BookMetaComp
                        key={id} meta={props.books[id]!} id={id}
                    />)
            }
        </Column>
    </SafeAreaView>,
);
