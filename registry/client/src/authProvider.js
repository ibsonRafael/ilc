import Cookies from 'js-cookie';

// Authenticatd by default
export default {
    login: ({ username, password }) => {
        const request = new Request('/auth/local', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
            });
    },
    logout: () => {
        Cookies.remove('ilc:userInfo');
        return fetch('/auth/logout')
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
            });
    },
    checkError: ({ status }) => {
        return status === 401
            ? Promise.reject()
            : Promise.resolve();
    },
    checkAuth: () => {
        return Cookies.get('ilc:userInfo')
            ? Promise.resolve()
            : Promise.reject();
    },
    getPermissions: () => {
        const userInfo = Cookies.getJSON('ilc:userInfo');

        if (!userInfo) {
            return Promise.reject();
        }

        const permissions = {
            role: userInfo.role,
            input: {
                disabled: userInfo.role === 'readonly',
            },
            jsonEditor: {
                mode: userInfo.role === 'readonly' ? 'view' : 'code',
            },
            buttons: {
                hidden: userInfo.role === 'readonly'
            },
        };

        return Promise.resolve(permissions);
    },
    getIdentity: () => {
        const userInfo = Cookies.getJSON('ilc:userInfo');

        return { id: userInfo.identifier, fullName: `${userInfo.identifier} ("${userInfo.role}" access)` };
    }
};
