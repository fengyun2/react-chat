import store from './store';

const { dispatch } = store;

// 用户
async function setUser(user) {
    user.groups.forEach((group) => {
        Object.assign(group, {
            type: 'group',
            unread: 0,
            messages: [],
            members: [],
        });
    });
    user.friends.forEach((friend) => {
        Object.assign(friend, {
            type: 'friend',
            _id: '',
            messages: [],
            unread: 0,
            avatar: friend.to.avatar,
            name: friend.to.username,
            to: friend.to._id,
        });
    });

    // 联系人
    const linkmans = [...user.groups, ...user.friends];
    const { _id, avatar, username, isAdmin } = user;
    dispatch({
        type: 'SetUser',
        user: {
            _id,
            avatar,
            username,
            linkmans,
            isAdmin,
        },
    });
}

function logout() {
    dispatch({
        type: 'Logout',
    });
}

function setAvatar(avatar) {
    dispatch({
        type: 'SetAvatar',
        avatar,
    });
}

// 联系人
function setFocus(linkmanId) {
    dispatch({
        type: 'SetFocus',
        linkmanId,
    });
}

// UI
function showLoginDialog() {
    dispatch({
        type: 'SetDeepValue',
        keys: ['ui', 'showLoginDialog'],
        value: true,
    });
}

function closeLoginDialog() {
    dispatch({
        type: 'SetDeepValue',
        keys: ['ui', 'showLoginDialog'],
        value: false,
    });
}

function setPrimaryColor(color) {
    dispatch({
        type: 'SetDeepValue',
        keys: ['ui', 'primaryColor'],
        value: color,
    });
    window.localStorage.setItem('primaryColor', color);
}

function setPrimaryTextColor(color) {
    dispatch({
        type: 'SetDeepValue',
        keys: ['ui', 'primaryTextColor'],
        value: color,
    });
    window.localStorage.setItem('primaryTextColor', color);
}

function setBackgroundImage(image) {
    dispatch({
        type: 'SetDeepValue',
        keys: ['ui', 'backgroundImage'],
        value: image,
    });
    window.localStorage.setItem('backgroundImage', image);
}

function setSound(sound) {
    dispatch({
        type: 'SetDeepValue',
        keys: ['ui', 'sound'],
        value: sound,
    });
    window.localStorage.setItem('sound', sound);
}

export default {
    setUser,
    logout,
    setAvatar,
    setFocus,

    showLoginDialog,
    closeLoginDialog,
    setPrimaryColor,
    setPrimaryTextColor,
    setBackgroundImage,
    setSound,
};
