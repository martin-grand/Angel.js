var ElementManager = (function () {
    var cache = [],
        _self = {},
        $document = $(document);

    _self.find = function (selector, $context, method) {
        var $element = ($context || $document)[method || 'find'](selector),
            element = new Element($element);

        cache.push(element);
        return cache.length - 1;
    };

    _self.get = function (cacheIndex) {
        return cache[cacheIndex];
    };

    _self.$get = function (cacheIndex) {
        if (cache.hasOwnProperty(cacheIndex)) {
            return cache[cacheIndex].$element;
        }
    };

    _self.add = function (cacheIndex, element) {
        cache[cacheIndex] = element;
    };

    _self.executeAction = function (cacheIndex, data, callback) {
        var element = _self.get(cacheIndex);

        if (element) {
            element.execute(data, callback);
        }
    };

    return _self;

})();
