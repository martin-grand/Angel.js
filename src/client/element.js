var Element = function ($element) {
    var _self = {},
        elementMethodType = {
            eventBinding: 1,
            simple: 2,
            findElement: 3,
        },
        elementMethodMap = {
            default: elementMethodType.simple,
            on: elementMethodType.eventBinding,
            find: elementMethodType.findElement,
            parent: elementMethodType.findElement,
            parents: elementMethodType.findElement,
        };

    _self.$element = $element;

    _self.execute = function (data, callback) {
        _self[elementMethodMap[data.method] || elementMethodMap.default](data, callback);
    };

    _self[elementMethodType.eventBinding] = function (data, callback) {
        if (!data.selector) {
            _self.$element.on(data.eventName, function (e) {
                callback(e.originalEvent);
            });
        } else {
            _self.$element.on(data.eventName, data.selector, function (e) {
                callback(e.originalEvent);
            });
        }
    };

    _self[elementMethodType.simple] = function (data, callback) {
        if (data.attribute) {
            if (data.attribute.length > 1) {
                _self.$element[data.method].apply(this, data.attribute);
            } else {
                _self.$element[data.method](data.attribute);
            }
            callback();
        } else {
            callback(_self.$element[data.method]());
        }
    };

    _self[elementMethodType.findElement] = function (data, callback) {
        callback(ElementManager.find(data.attribute, _self.$element, data.method));
    };

    return _self;

};

