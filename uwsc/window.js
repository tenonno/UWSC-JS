const { uwscFunc } = require('./uwsc');

const window = {

    move: uwscFunc('acw'),
    getID: uwscFunc('getid'),
    getStatus: uwscFunc('status'),
};

const WindowStatus = {

    X: 'ST_CLX',
    Y: 'ST_CLY',

};

module.exports = { window, WindowStatus };
