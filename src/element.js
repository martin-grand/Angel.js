class Element {
    constructor(session) {
        this.initialized = false;
        this.store = {};
        this.methodStack = [];
        this.session = session;

        return this;
    }

    init(cacheId) {
        this.element = cacheId;
        this.initialized = true;
        this.methodStack.forEach((fn) => fn());
        this.methodStack = null;
        if (this.store.onReadyCallback) {
            this.store.onReadyCallback();
        }

    }

    on(eventName, callback) { // or eventName, selector, callback
        let selector;

        eventName = arguments[0];
        callback = arguments[1];

        if (arguments.length === 3) {
            selector = arguments[1];
            callback = arguments[2];
        }

        if (eventName !== 'ready') {
            this.sendAction('element', {method: 'on', eventName: eventName, selector: selector}, callback);
        } else {
            this.store.onReadyCallback = callback;
        }

        return this;

    }

    sendAction(action, data, callback) {
        if (this.initialized) {
            this.session.sendAction(action, Object.assign(data, {element: this.element}), callback.bind(this));
        } else {
            this.methodStack.push(() => {
                this.session.sendAction(action, Object.assign(data, {element: this.element}), callback.bind(this));
            });
        }
    }

    sendActionPromise(method, attribute) {
        return new Promise((resolve) => {
            this.sendAction('element', {method: method, attribute: attribute}, resolve);
        });
    }

    html(attribute) {
        return this.sendActionPromise('html', attribute);
    }

    text(attribute) {
        return this.sendActionPromise('text', attribute);
    }

    val(attribute) {
        return this.sendActionPromise('val', attribute);
    }

    attr(attribute) {
        // todo handle this have 2 attributes. (name, value)
        return this.sendActionPromise('attr', attribute);
    }

    data(attribute) {
        return this.sendActionPromise('data', attribute);
    }

    hasClass(attribute) {
        return this.sendActionPromise('hasClass', attribute);
    }

    addClass(attribute) {
        this.sendActionPromise('addClass', attribute);
        return this;
    }

    removeClass(attribute) {
        this.sendActionPromise('removeClass', attribute);
        return this;
    }

    toggleClass(attribute) {
        this.sendActionPromise('toggleClass', attribute);
        return this;
    }

    find(selector) {
        const element = new Element(this.session);

        this.sendActionPromise('find', selector).then((elementCacheId) => {
            element.init(elementCacheId);
        });

        return element;
    }

    parent(selector) {
        const parentElem = new Element(this.session);

        this.sendActionPromise('parent', selector).then((elementCacheId) => {
            parentElem.init(elementCacheId);

            resolve(new Element(this.session, elementCacheId));
        });

        return new Promise((resolve) => {
            this.sendActionPromise('parent', selector).then((elementCacheId) => {
                resolve(new Element(this.session, elementCacheId));
            });
        });
    }

    parents(selector) {
        return new Promise((resolve) => {
            this.sendActionPromise('find', selector).then((elementCacheId) => {
                resolve(new Element(this.session, elementCacheId));
            });
        });
    }

    each(callback) {
        this.sendAction('each', {}, (elements) => {
            elements.forEach((elementCacheId) => {
                callback(new Element(this.session, elementCacheId));
            });
        });
        return this;
    }

    file(callback) {
        this.sendAction('flie', {}, (flie) => {
            callback(flie);
        });
    }

}

exports.Element = Element;
