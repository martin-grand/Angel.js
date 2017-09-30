const WebSocket = require('ws');
const http = require('http');
const net = require('net');
const fs = require('fs');
const Session = require('./session').Session;
const clientJs = require('./client').clientJs;
const getMessageContent = (data) => {
    const type = data.substring(0, 4);
    let value = data.substring(5);

    if (type === 'json') {
        try {
            value = JSON.parse(value);
        } catch (e) {
            console.error('invalid json', e);
        }
        return value;
    } else if ('text') {
        return value;
    }

};

class Angel {
    constructor(port) {
        this.settings = {};
        this.settings.clientJs = clientJs;
        this.settings.timeout = 10000;
        this.settings.defaultHead = '<title></title>';
        this.settings.responseHead = {'Content-Type': 'text/html'};
        this.settings.port = port;
        this.middlewares = [];
        this.sessions = {};

        this.requestMiddleware((request, response, next) => {
            if (request.url === '/angel.js') {
                response.writeHead(200, {'Content-Type': 'text/javascript'});
                response.end(this.settings.clientJs);
            } else {
                next();
            }
        });
    }

    createServer(port, callback) {
        if (typeof callback !== 'function') {
            throw new Error('webAppFactory.createServer 2nd attribute must be a function!');
        } else if (typeof port !== 'number' || port < 0 || port > 65535) {
            throw new Error('webAppFactory.createServer 1st attribute must be a valid port number!');
        }

        this.requestMiddleware((request, response, next) => {
            new Session(request, response, this);
        });

        this.settings.callback = callback;
        this.settings.port = this.settings.port || port + 1;
        http.createServer((request, response) => this.requestHandler(request, response)).listen(port);
        this.createSocket(this.settings.port);
    }

    requestHandler(request, response) {
        const runMiddleware = (index) => {
            this.middlewares[index](request, response, () => {
                runMiddleware(index + 1);
            });
        };

        runMiddleware(0);
    }

    requestMiddleware(fn) {
        this.middlewares.push(fn);
    }

    createSocket(port) {
        const server = new WebSocket.Server({port: port});

        server.on('connection', socket => {
            let initialized = false;
            let session = false;
            let sessionId = false;

            socket.on('message', message => {
                if (initialized) {
                    session.messageArrived(getMessageContent(message));
                } else {
                    if (sessionId = getMessageContent(message)) {
                        if (typeof sessionId === 'string' && this.sessions.hasOwnProperty(sessionId)) {
                            initialized = true;
                            session = this.sessions[sessionId];
                            session.socketArrived(socket);
                        }

                    }

                }

            });

            socket.on('close', () => {
                if (session) {
                    session.exit();
                }

            });
        });
    }

}

exports.instance = (port) => new Angel(port);
