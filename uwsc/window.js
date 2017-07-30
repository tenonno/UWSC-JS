const { uwscFunc } = require('./uwsc');

const window = {

    move: uwscFunc('acw'),
    getID: uwscFunc('getid'),


};

module.exports = window;
