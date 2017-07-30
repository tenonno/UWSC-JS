const { uwscFunc } = require('./uwsc');

const process = {

    exit: uwscFunc('exitexit'),
    call: uwscFunc('call', (uws) => {
        return `call ${uws.replace(/"/g, '')}`;
    }),

    newThread: uwscFunc('thread', (func, ...args) => {
        return `thread ${func}(${args.join(', ')})`;
    })

};

module.exports = process;
