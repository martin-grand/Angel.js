const Element = require('./element').Element;

class Document {
    constructor(session) {
        this.initialized = false;
        this.store = {};
        this.methodStack = [];
        this.session = session;
        this.store.url = this.session.request.url;
    }

    on(eventName, callback) {
        switch (eventName) {
            case 'ready':
                this.store.onReadyCallback = callback;
                break;
            case 'exit':
                this.store.onExitCallback = callback;
                break;
        }

    }

    sendAction(action, data, callback) {
        if (this.initialized) {
            this.session.sendAction(action, data, callback.bind(this));
        } else {
            this.methodStack.push(() => {
                this.session.sendAction(action, data, callback.bind(this));
            });
        }
    }

    sendActionPromise(method, attribute) {
        return new Promise((resolve) => {
            this.sendAction('document', {method: method, attribute: attribute}, resolve);
        });
    }

    find(attribute) {
        const element = new Element(this.session);

        this.sendActionPromise('find', attribute).then((elementCacheId) => {
            element.init(elementCacheId);
        });

        return element;
    }

    getElementCacheId(selector) {
        return new Promise(function (resovle) {
            this.sendActionPromise('find', selector).then((elementCacheId) => {
                resovle(elementCacheId);
            });
        });
    }

    html(attribute) {
        attribute = attribute.toString();
        this.store.html = attribute;
        if (this.initialized || attribute) {
            return this.sendActionPromise('html', attribute);
        }

    }

    body(attribute) {
        return this.sendActionPromise('body', attribute);
    }

    head(attribute) {
        return this.sendActionPromise('head', attribute);
    }

    title(attribute) {
        return this.sendActionPromise('title', attribute);
    }

    url(attribute) {
        if(attribute) {
            this.store.url = attribute;
            this.sendActionPromise('url', attribute);
        } else {
            return this.store.url;
        }

    }

    script(attribute) {
        return this.sendActionPromise('script', attribute);
    }

    render() {
        this.session.render();
    }

    exit() { // private!
        if (this.store.onExitCallback) {
            this.store.onExitCallback();
        }

    }

    ready() { // private!
        this.initialized = true;
        this.methodStack.forEach((fn) => fn());
        // Todo: not call here the html() method again!

        if (this.store.onReadyCallback) {
            this.store.onReadyCallback();
        }

    }

}

exports.Document = Document;
