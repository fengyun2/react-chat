import xss from 'xss';

const myXss = new xss.FilterXSS({
    whiteList: {},
});

export default function (text) {
    return myXss.process(text);
}
