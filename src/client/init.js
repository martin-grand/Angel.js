(function () {
    var _self = {},
        $document,
        clientId,
        port,
        connection,
        initialized = false,
        settings,
        messageActions = {};

    _self.init = function () {
        $document = $(document);
        clientId = $document.find('[data-angel-session-id]').attr('data-angel-session-id');
        port = $document.find('[data-angel-port]').attr('data-angel-port');
        connection = new WebSocket('ws://' + document.location.hostname + ':' + port);
        initBindings();
    };

    function initBindings() {
        connection.onmessage = function (event) {
            onMessage(getMessageContent(event.data));
        };

        connection.onopen = function () {
            initialized = true;
            sendText(clientId);
        };

        onAction('settings', function (data) {
            settings = data;
        });

        onAction('element', function (data, index) {
            ElementManager.executeAction(data.element, data, function (payload) {
                sendAction('element', payload, index);
            });
        });

        onAction('document', function (data, index) {
            Document.executeAction(data, function(payload){
                sendAction('document', payload, index);
            });
        });

    }

    function onMessage(message) {
        if (message.action && messageActions.hasOwnProperty(message.action)) {
            messageActions[message.action](message.data, message.index);
        }
    }

    function onAction(action, callback) {
        messageActions[action] = callback;
    }

    function sendAction(action, data, index) {
        sendJson({
            action: action,
            data: data,
            index: index
        });
    }

    function sendJson(json) {
        connection.send('json:' + JSON.stringify(json));
    }

    function sendText(text) {
        connection.send('text:' + text);
    }

    function getMessageContent(data) {
        var type = data.substring(0, 4),
            value = data.substring(5);

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

    }

    return _self;

})().init();
