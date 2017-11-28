# Angel.js (under developement!)
The request / document based Node.js server

## Example

```javascript
// On the server side:

const Angel = require('../src/angel.js').instance(8083);
//  8083 can be any unique port number for this node instance

Angel.createServer(80, function (request, document) {
    document.html('<a id="hello">Hello word!</a>');
    document.render();
    document.on('ready', () => {
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

### document.title
```javascript
document.title(); // returns 'My Awesome App'
document.title('You got one message!');
document.title(); // returns 'You got one message!'
document.head(); // returns '<link rel="shortcut icon" href="/favicon.ico" /><title>You got one message!</title>'
```
### document.url
```javascript
document.url(); // returns '/'
document.url('/redirect'); // redirect client to /redirect url
document.url(); // returns '/redirect'
```

### document.html
```javascript
document.html('<html><head><title>Hello!</title></head><body>Hello word...</body></html>'); // overrides all
document.html(); // returns '<html><head><title>Hello!</title></head><body>Hello word...</body></html>'
document.title('See me!');
document.html(); // returns '<html><head><title>See me!</title></head><body>Hello word...</body></html>'
```

### document.on('ready', fn)
```javascript
document.on('ready', function(){
    console.log('Client side has been rendered!');
});
```

### document.execute
```javascript
function ga_push(value) {
    document.execute(`ga.push('${value}')`); // execute script after document ready.
}

document.execute('new Date()').then(function(clientTime){
    console.log(clientTime);
});
```

## DOM elements
### document.find(selector)
This will return a dom element

### element.on
Attach an event handler function for one or more events to the selected elements.

### element.html
Get the HTML contents of the first element in the set of matched elements or set the HTML contents of every matched element.

### element.text
Get the combined text contents of each element in the set of matched elements, including their descendants, or set the text contents of the matched elements.

### element.val
Get the current value of the first element in the set of matched elements or set the value of every matched element.

### element.attr
Get the value of an attribute for the first element in the set of matched elements or set one or more attributes for every matched element.

### element.data
Store arbitrary data associated with the matched elements or return the value at the named data store for the first element in the set of matched elements.

### element.hasClass
Determine whether any of the matched elements are assigned the given class.

### element.addClass
Adds the specified class(es) to each element in the set of matched elements.

### element.removeClass
Remove a single class, multiple classes, or all classes from each element in the set of matched elements.

### element.toggleClass
Add or remove one or more classes from each element in the set of matched elements, depending on either the class’s presence or the value of the state argument.

### element.parent
Get the parent of each element in the current set of matched elements, optionally filtered by a selector.

### element.parents
Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.

### element.each
Iterate over elements, executing a function for each matched element.

### element.file
```javascript

```

### element.formData
```javascript

```
