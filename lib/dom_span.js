

exports.DomSpan = function () {
    this.initialize = function (iterator) {
        this._iterator = iterator;
    };

    this.pushLocation = function (location) {
        this._low = this._high;
        this._high = location;
    };

    this.getMatchingElement = function () {
        return this._iterator.elementAtLocation(this._low);
    };
    
    this.getLow = function () {
        return this._low;
    };

    this.getHigh = function () {
        return this._high;
    };

    this.atEnd = function (location) {
        var index, locationLength;
        var atEnd;
        if (location.length != this._high.length) {
            return false;
        }

        atEnd = true;
        locationLength = location.length;
        for (index = 0; index < locationLength; index++) {
            if (location[index] !== this._high[index]) {
                atEnd = false;
                break;
            }
        }
        return atEnd;
    };

    this.each = function (handler) {
        var location = this._low;
        while (true) {
            if (location.length === 0 || this.atEnd(location)) {
                break;
            }
            var element = this._iterator.elementAtLocation(location);
            if (element) {
                handler(element);
            }
            location = this._iterator.next(location);
        }
    };

    this.eachMatching = function (predicate, handler) {
        this.each(function (element) {
            if (predicate(element)) {
                handler(element);
            }
        });
    };

    this.eachElementByTagName = function (tagName, handler) {
        this.eachMatching(function (element) {
            return element.tagName === tagName;
        }, handler);
    };

    this.isJSON = function (text) {
        var jsonPattern = /[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/;
        var replacement = /"(\\.|[^"\\])*"/g

        return !jsonPattern.test(text.replace(replacement, ''))
    }

    this.dataWithin = function (retainNodes) {
        var data = {};
        var isJSON = this.isJSON;
        var index, toRemove = [], element;

        this.eachElementByTagName('CODE', function (element) {
            var text = element.textContent.trim();
            var currentData = {};
            var key;
            if (isJSON(text)) {
                currentData = eval('(' + text + ')');
                
                for (key in currentData) {
                    if (currentData.hasOwnProperty(key)) {
                        data[key] = currentData[key];
                    }
                }

                if (!retainNodes) {
                    toRemove.push(element);
                }
            }
        });

        for (index = toRemove.length; index--;) {
            element = toRemove[index];
            element.parentNode.removeChild(element);
        }

        return data;
    };

    this.initialize.apply(this, arguments);
};