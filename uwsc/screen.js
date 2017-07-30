const { uwscFunc } = require('./uwsc');

const screen = {

    getPixel: uwscFunc('peekcolor'),

};

module.exports = screen;
