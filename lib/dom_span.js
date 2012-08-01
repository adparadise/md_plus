

exports.DomSpan = function () {
    this.initialize = function (iterator) {
        this._iterator = iterator;
    };

    this.pushLocation = function (location) {
        this._low = this._high;
        this._high = location;
    };
    
    this.getLow = function () {
        return this._low;
    };

    this.getHigh = function () {
        return this._high;
    };

    this.initialize.apply(this, arguments);
};