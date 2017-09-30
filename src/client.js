const fs = require('fs');
const uglify = require('uglify-js');
const script = (script) => fs.readFileSync(`${__dirname}/client/${script}.js`);
const code = `(function(window, document){
    ${script('jquery')};
    ${script('init')};
    ${script('element')};
    ${script('elementManager')};
    ${script('document')};
    ${script('location')};
})(window, document);`;

exports.clientJs = code; //uglify.minify(code).code;
