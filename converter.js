const fs = require('mz/fs');

const esprima = require('esprima');

function uwscFunc(name) {
    const func = () => {};
    func.uwsc = name;
    return func;
}

const process = require('./uwsc/process');
const { window, WindowStatus } = require('./uwsc/window');
const screen = require('./uwsc/screen');
const image = require('./uwsc/image');
const { color, ColorType } = require('./uwsc/color');
const { input, Mouse } = require('./uwsc/input');


const img = () => {}


console.log.uwsc = {
    name: 'print',
    parser: (data) => `print ${data}`
};

function varToStr(v) {

    if (v.type === 'Literal') {
        return v.raw;
    } else if (v.type === 'Identifier') {
        return v.name;
    } else {
        console.error('不明な Var です');
    }

}

const converter = {};
convert();

fs.watch('main.js', convert);

const chkimg = () => {};

function parseFunctionUWSC(expression) {

    let obj;
    let prop;

    if (expression.callee.name) {
        obj = expression.callee.name;
    } else {
        obj = expression.callee.object.name;
        prop = expression.callee.property.name;
    }

    let args = expression.arguments.map((arg) => {



        if (arg.type === 'Literal') {
            return arg.raw.replace(/'/g, '"');
        } else if (arg.type === 'Identifier') {
            return arg.name;
        } else if (arg.type === 'CallExpression') {
            return parseFunctionUWSC(arg);
        } else if (arg.type === 'MemberExpression') {
            return eval(`${arg.object.name}.${arg.property.name}`);
        } else if (arg.type === 'BinaryExpression') {
            return `${varToStr(arg.left)} ${arg.operator} ${varToStr(arg.right)}`;
        } else {
            console.log('不明な引数です: ' + arg.type)
        }

    });

    // console.warn(args);

    let s = '';
    if (prop) {


        s = `
(() => {
    if (${obj} && ${obj}.${prop} && ${obj}.${prop}.uwsc) {
        return ${obj}.${prop};
    }
})();
`;
        // 仮
    } else {
        s = `
        (() => {
        if (${obj} && ${obj}.uwsc) {
        return ${obj};
        }
        })();
        `;
    }

    const evalResult = eval(s);

    if (!evalResult) {
        return `print("${obj}.${prop}")`;
    }
    // UWSC の関数名を取得する
    const { uwsc } = evalResult;

    if (uwsc.parser) {
        return uwsc.parser(...args);
    }

    args = args.join(', ');

    return `${uwsc.name}${args ? '(' + args + ')' : ''}`;

}

async function convert() {

    const AA = require('./main');


    // ブロックの概念がない
    converter['BlockStatement'] = (data) => {
        return { nest: 0 };
    };


    converter['BreakStatement'] = (data) => { begin: 'break\n' };



    converter['ExpressionStatement'] = ({ expression }) => {

        //console.log(expression);


        return {
            begin: parseFunctionUWSC(expression) + '\n'
        };

    };





    converter['VariableDeclaration'] = (data) => {

        const kind = {
            const: 'const',
            let: 'dim',
            var: 'dim'
        }[data.kind];

        // 同時に複数の変数を宣言する
        if (data.declarations.length >= 2) {
            console.error('data.declarations.length');
        }

        const declarator = data.declarations[0];


        let rvalue = '';

        if (declarator.init.type === 'Literal') {


            const value = declarator.init.raw; //).replace(/'/g, '"');

            rvalue = value.replace(/'/g, '"');
        } else if (declarator.init.type === 'CallExpression') {

            rvalue = parseFunctionUWSC(declarator.init);

        } else if (declarator.init.type === 'BinaryExpression') {

            rvalue = `${varToStr(declarator.init.left)} ${declarator.init.operator} ${varToStr(declarator.init.right)}`;

        } else {
            console.error('Var Error');
            console.log(declarator);
        }

        const name = declarator.id.name;

        return {
            begin: `${kind} ${name} = ${rvalue}\n`
        };
    };


    converter['FunctionDeclaration'] = (data) => {

        if (data.params.length) {
            console.error('function params error');
        }

        return {
            begin: `procedure ${data.id.name}()\n`,
            end: 'fend\n'
        };
    };


    converter['IfStatement'] = (data) => {

        let ex = '';



        if (data.test.type === 'CallExpression') {

            ex = parseFunctionUWSC(data.test);
        } else if (data.test.type === 'BinaryExpression') {
            ex = `${varToStr(data.test.left)} ${data.test.operator} ${varToStr(data.test.right)}`;
        } else {
            console.error('IF Error');
            console.error(data);
        }
        return {
            begin: `if (${ex})\n`,
            end: 'endif\n'
        };

    };


    converter['WhileStatement'] = (data) => {

        if (data.test.type !== 'Literal') {
            console.error('while test error');
            return;
        }

        return {
            begin: `while ${data.test.value}\n`,
            end: 'wend\n'

        };
    };



    const src = AA.toString();

    const javascript = src.substr(src.indexOf('\n') + 1).slice(0, -1);



    const data = esprima.parse(javascript);

    let result = '';

    parse(data);

    function getChildren(v) {

        // if の中は body ではなく consequent
        if (v.consequent) return [v.consequent];

        if (!v.body) return [];
        if (!Array.isArray(v.body)) return [v.body];
        return v.body;

    }


    function parse(node, nest = -1) {

        const { type } = node;

        const conv = converter[type] || (() => {});

        let r = conv(node);


        const tab = '  '.repeat(Math.max(nest, 0));


        if (r && r.begin) result += tab + r.begin;

        const addNest = (r && r.nest !== undefined) ? r.nest : 1;





        getChildren(node).forEach((w) => {

            parse(w, nest + addNest);

        });

        if (r && r.end) result += tab + r.end;

    }

    fs.writeFile('script.uws', result);

}
