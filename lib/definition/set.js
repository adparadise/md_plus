

exports.Set = function () {
    this.initialize = function (definitions) {
        this._definitions = definitions;
    };

    this.isValid = function () {
        var index, error;
        if (!this._definitions || typeof this._definitions.length !== "number") {
            return false;
        }
        for (index = this._definitions.length; index--;) {
            if (!this._definitions[index].validate) {
                return false;
            }
            error = this._definitions[index].validate();
            if (error.anyErrors()) {
                return false;
            }
        }
        return true;
    };

    this.initialize.apply(this, arguments);
};