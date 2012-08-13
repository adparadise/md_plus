

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
            handler(this._iterator.elementAtLocation(location));
            location = this._iterator.next(location);
        }
    };

    this.initialize.apply(this, arguments);
};