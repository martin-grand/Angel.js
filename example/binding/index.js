const Angel = require('../src/angel.js').instance(8083); //  <- unique port number fot this node instance

Angel.createServer(80, function (request, $document) {
    $document.html('<a id="hello">Hello word...</a>');
    $document.render();
    $document.onReady(() => {
        $document.find('#hello').on('click', function () {
            console.log('hello word clicked!');
            this.text('Has been clicked..');
        });
    });
});