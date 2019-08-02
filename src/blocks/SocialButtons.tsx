/*global FB*/
import * as React from 'react';

import { Column } from '../blocks';
import { Callback } from '../utils';

type SocialLoginResultFail = {
    success: false,
};
type SocialLoginResultSuccess = {
    success: true,
    token: string,
};
export type SocialLoginResult = SocialLoginResultSuccess | SocialLoginResultFail;

type SocialButtonProps = {
    clientId: string,
    onLogin?: Callback<SocialLoginResult>,
};

export type FacebookLoginProps = SocialButtonProps;
export function FacebookLogin({ clientId, onLogin }: FacebookLoginProps) {
    React.useEffect(() => {
        initFbSdk(clientId);
    }, [clientId]);
    return <Column>
        <button onClick={() => FB.login(res => {
            console.log(res);
        })}>Login with facebook</button>
    </Column>;
}

function initFbSdk(clientId: string) {
    const win = window as any;
    win.fbAsyncInit = function () {
        FB.init({
            appId: clientId,
            cookie: true,
            xfbml: true,
            version: 'v2.8',
        });
    };

    // Load the SDK asynchronously
    (function (d, s, id) {
        let js: any;
        const fjs: any = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}
