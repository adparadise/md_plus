
var Info = require('./validation/info.js').Info;
var Set = function () {
    this.initialize = function (definitions) {
        this._definitions = definitions;
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

    this.getCandidatesAt = function (location) {
        var candidates = []
        var popLength, locationLength = location.length;
        for (popLength = 0; popLength <= locationLength; popLength++) {
            this._addCandidatesPeerTo(location, popLength, candidates);
        }
        
        return candidates;
    }

    this._addCandidatesPeerTo = function (location, popLength, candidates) {
        var offset, definitionCount, definition;
        var currentDefinition = this.getDefinitionAtLocation(location, popLength);
        definitionCount = currentDefinition.getDefinitionCount();
        for (offset = 0; offset < definitionCount; offset++) {
            definition = currentDefinition.getChildAt(offset);
            if (definition) {
                candidates.push(definition);
            }
        }
    };

    this.getDefinitionAtLocation = function (location, popLength) {
        var definition = this;
        var index, locationLength = location.length;
        popLength = popLength || 0;
        for (index = 0; index < locationLength - popLength; index++) {
            definition = definition.getChildAt(location[index]);
        }

        return definition;
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