

exports.Parser = function () {
    this.initialize = function (container, definition) {
        this._container = container;
        this._definition = definition;
    }
    
    this.initialize.apply(this, arguments);
};