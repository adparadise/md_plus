
var Info = require('./validation/info.js').Info;
var Set = function () {
    this.initialize = function (definitions) {
        this._definitions = definitions;
    };

    this.getID = function () {
        return [];
    };

    // Assumes refPath declares a unique path from the root.
    this.getDefinition = function (refPath) {
        var offset, definitionCount;
        var parent = this;
        var definition;
        var refs = refPath.split("/");
        var index, ref, refsLength = refs.length;
        var child;
        
        for (index = 0; index < refsLength; index++) {
            ref = refs[index];
            child = undefined;
            definitionCount = parent.getDefinitionCount()
            for (offset = 0; offset < definitionCount; offset++) {
                definition = parent.getChildAt(offset);
                if (definition.get('ref') === ref) {
                    child = definition;
                    break;
                }
            }
            if (!child) {
                // The trail is cold, we will return undefined.
                parent = undefined;
                break;
            }
            parent = child;
        }

        return parent;
    };

    this.setHandler = function (refPath, handler, context) {
        var definition = this.getDefinition(refPath);
        definition.setHandler(handler, context);
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

    this.eachDefinition = function (callback) {
        var offset, definitionCount = this.getDefinitionCount();
        var definition;
        for (offset = 0; offset < definitionCount; offset++) {
            definition = this.getChildAt(offset);
            definition.eachDefinition(callback);
        }
    };

    this.initialize.apply(this, arguments);
};

Set.Validation = require('./set/validation.js');

exports.Set = Set;