
var Info = require('./validation/info.js').Info;
var Set = function () {
    this.initialize = function (definitions) {
        this._definitions = definitions;
    };

    this.getID = function () {
        return [];
    };

    this.bakeIDs = function () {
        var offset, definitionCount = this.getDefinitionCount();
        var definition;
        for (offset = 0; offset < definitionCount; offset++) {
            definition = this.getChildAt(offset);
            definition.bakeIDs([offset]);
        }
    };

    this.validate = function () {
        if (!this._validationInfo) {
            this._validationInfo = Set.Validation.validate(this);
        }
        return this._validationInfo;
    };

    this.isValid = function () {
        return !this.validate().anyErrors();
    };

    this.getChildAt = function (offset) {
        if (!this._definitions || typeof this._definitions.length !== "number") {
            return;
        }
        return this._definitions[offset];
    };

    this.getDefinitionCount = function () {
        if (!this._definitions || typeof this._definitions.length !== "number") {
            return 0;
        }
        return this._definitions.length;
    };

    this.initialize.apply(this, arguments);
};

Set.Validation = require('./set/validation.js');

exports.Set = Set;