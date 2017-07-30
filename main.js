module.exports = function() {
    process.newThread(Func);

    var a = 0;
    let b = 'text';
    const x = 123;
    const y = 456;
    const id = window.getID('name', 'class');
    window.move(id, 0, 0);
    screen.getPixel(0, 0, ColorType.R);
    input.simulate(Mouse.Left, Mouse.Click, 0, 0, 100)
    console.log('test')
    if (image.detect('test.bmp', 1, 0, 0, 0, 0)) {
        console.log('end');
        process.exit();
    }

    function Func() {
        process.call('進捗.uws');
    }
};
