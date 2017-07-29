console.clear();

function uwscFunc(name) {
    const func = () => {};
    func.uwsc = name;
    return func;
}

const process = {

    exit: uwscFunc('exitexit'),
    call: uwscFunc('exitexit')

};


function AA() {

    const x = 0;
    const y = 'w';

    // aaa

    while (true) {
        console.log(1);

        process.exit();
    }

    function 狩り部分() {
        process.call('akumu.uws');
    }

}


const converter = {};

class Converter {
    constructor(prop) {

        this.begin = prop.begin;
        this.end = prop.end;

    }
}

(async() => {

    await new Promise((resolve) => {
        const script = document.createElement('script');
        script.onload = resolve;
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/esprima/2.7.3/esprima.min.js';
        document.body.appendChild(script);
    });

    // ブロックの概念がない
    converter['BlockStatement'] = (data) => { nest: 0 };


    converter['BreakStatement'] = (data) => { begin: 'break\n' };


    converter['ExpressionStatement'] = ({ expression }) => {



        const obj = expression.callee.object.name;
        const prop = expression.callee.property.name;

        const args = expression.arguments.map((arg) => {
            // ' を " に変換する ( 文字列対策 )
            return arg.raw.replace(/'/g, '"');
        }).join(', ');

        console.warn(args);

        const s = `
    (() => {
    	if (${obj} && ${obj}.${prop} && ${obj}.${prop}.uwsc) {
    		return {
        	name: ${obj}.${prop}.uwsc,
          isFunction: ${obj}.${prop}.isFunction
        };
    	}
    })();
    `;

        // UWSC の関数名を取得する
        const uwsc = eval(s);


        if (uwsc) {
            return {
                begin: `${uwsc.name}${args ? '(' + args + ')' : ''}\n`
            };
        } else {
            return {
                begin: `print("${obj}.${prop}")\n`
            };
        }

        // console.warn(expression)




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

        const name = declarator.id.name;
        const value = declarator.init.raw.replace(/'/g, '"');


        return {
            begin: `${kind} ${name} = ${value}\n`
        };

    };



    converter['WhileStatement'] = (data) => {


        return {
            begin: 'while\n',
            end: 'wend\n'

        };
    };



    const src = AA.toString();

    const javascript = src.substr(src.indexOf('\n') + 1).slice(0, -1);

    console.log(javascript);
    console.log(esprima);


    /*
  esprima.tokenize(javascript).forEach((token) => {

  	console.log(token);


  });

*/

    const data = esprima.parse(javascript);

    let result = '';

    parse(data);

    function getChildren(v) {

        if (!v.body) return [];
        if (!Array.isArray(v.body)) return [v.body];
        return v.body;

    }


    function parse(node, nest = 0) {



        var aa = '';

        // console.log(nest, node, node.type);

        const { type } = node;

        const conv = converter[type] || (() => {});

        let r = conv(node);

        const tab = '  '.repeat(nest);

        console.log('  '.repeat(nest) + node.type);

        if (r && r.begin) result += tab + r.begin;

        const addNest = (r && r.nest !== undefined) ? r.nest : 1;

        getChildren(node).forEach((w) => {

            parse(w, nest + addNest);

        });

        if (r && r.end) result += tab + r.end;

    }

    console.info(result);



})();
