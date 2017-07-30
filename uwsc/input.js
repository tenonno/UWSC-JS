const { uwscFunc } = require('./uwsc');

const input = {

    simulate: uwscFunc('btn')

};

const Mouse = {

    Left: 'LEFT',
    Right: 'RIGHT',

    Click: 'CLICK'

};

module.exports = { input, Mouse };
