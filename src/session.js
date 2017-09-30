const Document = require('./document').Document;
const generateSessionId = () =>
    `_${(Math.random().toString(36) +
    (new Date().getTime()).toString(36) +
    Math.random().toString(36)).replace(/\./g, '')}`;

class Session {
    constructor(request, response, webAppFactory) {
        this.request = request;
        this.response = response;
        this.rendered = false;
        this.webAppFactory = webAppFactory;
        this.actionIndex = 0;
        this.messageSubscriptions = {};
        this.actions = {};
        this.document = new Document(this);
        this.sessionId = generateSessionId();
        this.timeout = setTimeout(this.exit.bind(this), this.webAppFactory.settings.timeout);
        this.elementCache = [];
        webAppFactory.sessions[this.sessionId] = this;
        webAppFactory.settings.callback(request, this.document);
    }

    socketArrived(client) {
        clearTimeout(this.timeout);
        delete this.webAppFactory.sessions[this.sessionId];
        this.client = client;
        this.sendAction('settings', this.webAppFactory.settings);
        this.document.ready();
    }

    messageArrived(message) {
        if (this.messageSubscriptions.hasOwnProperty(message.action)) {
            this.messageSubscriptions[message.action].forEach((callback) => {
                callback(message.data);
            });
        }
        if (this.actions.hasOwnProperty(message.index)) {
            this.actions[message.index](message.data);
        }

    }

    render(head) {
        this.response.writeHead(200, head || this.webAppFactory.settings.responseHead);
        this.response.end(`${this.document.store.html}
            <script src="/angel.js" 
                data-angel-session-id="${this.sessionId}" 
                data-angel-port="${this.webAppFactory.settings.port}">                
            </script>`);
        this.rendered = true;
    }

    exit() {
        this.document.exit();
    }

    sendAction(action, data, callback) {
        const actualActionIndex = this.actionIndex;

        this.actions[actualActionIndex] = (payload) => {
            if (callback) {
                callback(payload);
            }

            if (data.method !== 'on') {
                delete this.actions[actualActionIndex];
            }

        };

        this.client.send(`json:${JSON.stringify({
            action: action,
            data: data,
            index: this.actionIndex++
        })}`);
    }

    onAction(action, callback) {
        this.messageSubscriptions[action] = this.messageSubscriptions[action] || [];
        this.messageSubscriptions[action].push(callback);
    }

    addElementToCache(cacheId, element) {
        return this.elementCache[cacheId] = element;
    }

    getElementByCacheId(cacheId) {
        return this.elementCache[cacheId];
    }

}

exports.Session = Session;
