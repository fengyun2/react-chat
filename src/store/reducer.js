import immutable from 'immutable';
import setCssVariable from '../utils/setCssVariable';
import config from '../config';

// 设置主色
const primaryColor = window.localStorage.getItem('primaryColor') || config.primaryColor;
const primaryTextColor = window.localStorage.getItem('primaryTextColor') || config.primaryTextColor;
setCssVariable(primaryColor, primaryTextColor);

// 设置背景
let backgroundImage = window.localStorage.getItem('backgroundImage');
if (!backgroundImage) {
  backgroundImage = config.backgroundImage;
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const base64 = canvas.toDataURL('image/png');
    window.localStorage.setItem('backgroundImage', base64);
  };
  img.src = backgroundImage;
}

// 设置音效
const sound = window.localStorage.getItem('sound') || config.sound;

let soundSwitch = window.localStorage.getItem('soundSwitch') || 'true';
if (soundSwitch === 'true') {
  soundSwitch = true;
} else {
  soundSwitch = false;
}

// 设置通知
let notificationSwitch = window.localStorage.getItem('notificationSwitch') || 'true';
if (notificationSwitch === 'true') {
  notificationSwitch = true;
} else {
  notificationSwitch = false;
}

// 设置音乐
let voiceSwitch = window.localStorage.getItem('voiceSwitch') || 'true';
if (voiceSwitch === 'true') {
  voiceSwitch = true;
} else {
  voiceSwitch = false;
}

const initialState = immutable.fromJS({
  user: null,
  focus: '',
  connect: true,
  ui: {
    showLoginDialog: false,
    primaryColor,
    primaryTextColor,
    backgroundImage,
    sound,
    soundSwitch,
    notificationSwitch,
    voiceSwitch
  }
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'Logout': {
      const keepKeys = [
        ['ui', 'primaryColor'],
        ['ui', 'primaryTextColor'],
        ['ui', 'backgroundImage'],
        ['ui', 'sound']
      ];
      let newState = initialState;
      keepKeys.forEach(key => {
        newState = newState.setIn(key, state.getIn(key));
      });
      return newState;
    }
    case 'SetDeepValue': {
      return state.setIn(action.keys, immutable.fromJS(action.value));
    }
    case 'SetUser': {
      let newState = state;
      if (state.getIn(['user', '_id']) === undefined) {
        newState = newState
          .set('user', immutable.fromJS(action.user))
          .set('focus', state.get('focus') || action.user.linkmans[0]._id);
      } else {
        newState = newState.updateIn(['user', 'linkmans'], linkmans => {
          let newLinkmans = linkmans;
          action.user.linkmans.forEach(linkman => {
            const index = linkmans.findIndex(l => l.get('_id') === linkman._id);
            if (index === -1) {
              newLinkmans = newLinkmans.push(immutable.fromJS(linkman));
            }
          });
          newLinkmans.forEach((linkman, linkmanIndex) => {
            const index = action.user.linkmans.findIndex(l => l._id === linkman.get('_id'));
            if (index === -1) {
              newLinkmans = newLinkmans.splice(linkmanIndex, 1);
            }
          });

          return newLinkmans;
        });

        const focusIndex = newState
          .getIn(['user', 'linkmans'])
          .findIndex(l => l.get('_id') === newState.get('focus'));
        if (focusIndex === -1) {
          newState = newState.set('focus', newState.getIn(['user', 'linkmans', 0, '_id']));
        }
      }

      return newState;
    }
    case 'SetLinkmanMessages': {
      const newLinkmans = state
        .getIn(['user', 'linkmans'])
        .map(linkman => {
          linkman.set('messages', immutable.fromJS(action.messages[linkman.get('_id')]));
        })
        .sort((linkman1, linkman2) => {
          const messages1 = linkman1.get('messages');
          const messages2 = linkman2.get('messages');
          const time1 =
            messages1.size > 0
              ? messages1.get(messages1.size - 1).get('createTime')
              : linkman1.get('createTime');
          const time2 =
            messages2.size > 0
              ? messages2.get(messages2.size - 1).get('createTime')
              : linkman2.get('createTime');
          return new Date(time1) < new Date(time2);
        });

      return state
        .setIn(['user', 'linkmans'], newLinkmans)
        .set('focus', state.get('focus') || newLinkmans.getIn([0, '_id']));
    }
    case 'SetGroupMembers': {
      const linkmanIndex = state
        .getIn(['user', 'linkman'])
        .findIndex(l => l.get('_id') === action.groupId);
      return state.setIn(
        ['user', 'linkman', linkmanIndex, 'members'],
        immutable.fromJS(action.members)
      );
    }
    case 'SetGroupAvatar': {
      const linkmanIndex = state
        .getIn(['user', 'linkmans'])
        .findIndex(l => l.get('_id') === action.groupId);
      return state.setIn(['user', 'linkmans', linkmanIndex, 'avatar'], action.avatar);
    }
    case 'SetFocus': {
      const linkmanIndex = state
        .getIn(['user', 'linkmans'])
        .findIndex(l => l.get('_id') === action.linkmanId);
      return state
        .set('focus', action.linkmanId)
        .setIn(['user', 'linkmans', linkmanIndex, 'unread'], 0);
    }
    case 'SetFriend': {
      const linkmanIndex = state
        .getIn(['user', 'linkmans'])
        .findIndex(l => l.get('_id') === action.linkmanId);

      return state
        .updateIn(['user', 'linkmans', linkmanIndex], linkman =>
          linkman
            .set('type', 'friend')
            .set('from', action.from)
            .set('to', action.to)
            .set('unread', 0)
        )
        .set('focus', action.linkmanId);
    }
    default: {
      return state;
    }
  }
}

export default reducer;
