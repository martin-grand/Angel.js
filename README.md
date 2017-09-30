# Angel.js
The request / document based Node.js server

## Example

```
// On the server side:
const webAppFactory = require('../src/angel.js').webAppFactory(8083); //  <- unique port number fot this node instance

webAppFactory.createServer(80, function (request, $document) {
    $document.html('<a id="hello">Hello word...</a>');
    $document.render();
    $document.onReady(() => {
        $document.find('#hello').on('click', function () {
            console.log('hello word clicked!');
            this.text('Has been clicked..');
        });
    });
});
```

## Available methods:

### $document.body
$document.body(); // returns undefined
$document.body('Hello word...');
$document.body(); // returns 'Hello word...'

### $document.head
const head = '<link rel="shortcut icon" href="/favicon.ico" /><title>My Awesome App</title>';

$document.head(); // returns '<title></title>'
$document.head(head);
$document.head(); // returns '<link rel="shortcut icon" href="/favicon.ico" /><title>My Awesome App</title>'

## $document.title
$document.title(); // returns 'My Awesome App'
$document.title('You got one message!');
$document.title(); // returns 'You got one message!'
$document.head(); // returns '<link rel="shortcut icon" href="/favicon.ico" /><title>You got one message!</title>'

### $document.html
$document.html('<html><head><title>Hello!</title></head><body>Hello word...</body></html>'); // overrides all!
$document.html(); // returns '<html><head><title>Hello!</title></head><body>Hello word...</body></html>'
$document.title('See me!');
$document.html(); // returns '<html><head><title>See me!</title></head><body>Hello word...</body></html>'

## Document events

### $document.onReady

$document.onReady(function(){
    console.log('Client side has rendered!');
});

### $document.eval
```
function ga_push(value) {
    $document.eval(`ga.push('${value}')`); // eval just after document ready event.
}

$document.eval('new Date()').then(function(clientTime){
    console.log(clientTime);
});
```


### $document.global
```
$document.global('myGlobalFunction', function(attributes){
    console.log('myGlobalFunction called from client side');
});

$document.global('myGlobalVariable', 'foo');
```
