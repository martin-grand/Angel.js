const Angel = require('../../src/angel.js').instance(8083); //  <- unique port number for this node instance
let times = 0;

Angel.createServer(80, function (request, document) {
    document.html('<button id="hello">Hello word!</button>');
    document.render();
    document.on('ready', () => {
        document.find('#hello').on('click', function () {
            console.log('hello word clicked!');
            times++;
            this.text(`It has been clicked${times > 1 ? ` ${times} times` : ''}`);
        });
    });
});