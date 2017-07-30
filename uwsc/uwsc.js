function uwscFunc(name, parser) {
    const func = () => {};
    func.uwsc = {
        name,
        parser
    };
    return func;
}

module.exports = { uwscFunc };
