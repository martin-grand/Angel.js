var Document = (function () {
    var _self = {};

    _self.$element = $(document);
    _self.$body = $(document.body);
    _self.$head = $(document.head);

    _self.find = function (selector, callback) {
        callback(ElementManager.find(selector));
    };

    _self.html = function (html, callback) {
        if (html) {
            var parser = new DOMParser(),
                doc = parser.parseFromString(html, 'text/html');

            _self.$body.html(doc.body.innerHTML);
            _self.$head.html(doc.head.innerHTML);
            callback();
        } else {
            callback(document.documentElement.innerHTML);
        }

    };

    _self.body = function (html, callback) {
        if (html) {
            _self.$body.html(html);
            callback();
        } else {
            callback(_self.$body.html());
        }

    };

    _self.head = function (html, callback) {
        if (html) {
            _self.$head.html(html);
            callback();
        } else {
            callback(_self.$head.html());
        }

    };

    _self.title = function (text, callback) {
        if (text) {
            document.title = text;
            callback();
        } else {
            callback(document.title);
        }

    };

    _self.url = function (url, callback) {
        if (url) {
            window.history.pushState({}, '', url);
            callback();
        } else {
            callback(document.location.pathname + document.location.search);
        }

    };

    _self.script = function (script, callback) {
        callback(window.eval(script));
    };

    _self.executeAction = function (data, callback) {
        switch (data.method) {
            case 'find':
                _self.find(data.attribute, callback);
                break;
            case 'html':
                _self.html(data.attribute, callback);
                break;
            case 'url':
                _self.url(data.attribute, callback);
                break;
        }
    };

    return _self;

})();
