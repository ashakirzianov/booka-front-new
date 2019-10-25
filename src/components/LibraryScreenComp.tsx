import * as React from 'react';

import { LibraryScreen, Theme, User, HasTheme } from '../model';
import { Triad, FileUploadDialog, FileUploadDialogRef } from '../blocks';
import { LibraryComp } from './LibraryComp';
import { TextLine, IconButton, connectState } from './Connected';
import { AccountButton } from './AccountButton';
import { uploadBook } from '../api';

export type LibraryScreenHeaderProps = {
    theme: Theme,
    user: User | undefined,
};
export function LibraryScreenHeader({ theme, user }: LibraryScreenHeaderProps) {
    return <Triad
        center={<TextLine text='Library' />}
        right={
            <>
                <UploadButton />
                <AccountButton theme={theme} user={user} />
            </>
        }
    />;
}

export type LibraryScreenProps = HasTheme & {
    screen: LibraryScreen,
};
export function LibraryScreenComp({ screen, theme }: LibraryScreenProps) {
    return <LibraryComp
        theme={theme}
        library={screen.library}
    />;
}

type UploadButtonProps = {
    user: User | undefined,
};
function UploadButtonC({ user }: UploadButtonProps) {
    const uploadRef = React.useRef<FileUploadDialogRef>();
    return user
        ? <>
            <FileUploadDialog
                accept='application/epub+zip'
                dataKey='book'
                refCallback={r => uploadRef.current = r}
                onFilesSelected={async data => {
                    await uploadBook(data.data, user.token);
                }}
            />
            <IconButton
                icon='upload'
                onClick={() => uploadRef.current && uploadRef.current.show()}
            />
        </>
        : null;
}
const UploadButton = connectState('user')(UploadButtonC);
