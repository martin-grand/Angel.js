# Angel.js
The request / document based Node.js server

## Example

```javascript
// On the server side:

const Angel = require('../src/angel.js').instance(8083);
//  8083 can be any unique port number for this node instance

Angel.createServer(80, function (request, document) {
    document.html('<a id="hello">Hello word!</a>');
    document.render();
    document.onReady(() => {
        document.find('#hello').on('click', function () {
            console.log('hello word clicked!');
            this.text('It has been clicked');
        });
    });
});
```

## Available methods:

### document.body
```javascript
document.body(); // returns undefined
document.body('Hello word...');
document.body(); // returns 'Hello word...'
```

### document.head
```javascript
const head = '<link rel="shortcut icon" href="/favicon.ico" /><title>My Awesome App</title>';

document.head(); // returns '<title></title>'
document.head(head);
document.head(); // returns '<link rel="shortcut icon" href="/favicon.ico" /><title>My Awesome App</title>'
```

## document.title
```javascript
document.title(); // returns 'My Awesome App'
document.title('You got one message!');
document.title(); // returns 'You got one message!'
document.head(); // returns '<link rel="shortcut icon" href="/favicon.ico" /><title>You got one message!</title>'
```

### document.html
```javascript
document.html('<html><head><title>Hello!</title></head><body>Hello word...</body></html>'); // overrides all
document.html(); // returns '<html><head><title>Hello!</title></head><body>Hello word...</body></html>'
document.title('See me!');
document.html(); // returns '<html><head><title>See me!</title></head><body>Hello word...</body></html>'
```

## Document events

### document.on('ready', fn)
```javascript
document.on('ready', function(){
    console.log('Client side has been rendered!');
});
```

### document.eval
```javascript
function ga_push(value) {
    document.eval(`ga.push('${value}')`); // eval after document ready.
}

document.eval('new Date()').then(function(clientTime){
    console.log(clientTime);
});
```

## DOM elements
### document.find(selector)
This will return a dom element

### element.on
```javascript

```

### element.html
```javascript

```

### element.text
```javascript

```

### element.val
```javascript

```

### element.attr
```javascript

```

### element.data
```javascript

```

### element.hasClass
```javascript

```

### element.addClass
```javascript

```

### element.removeClass
```javascript

```

### element.toggleClass
```javascript

```

### element.parent
```javascript

```

### element.each
```javascript

```

### element.file
```javascript

```
