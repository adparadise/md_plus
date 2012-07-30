

var CandidatesBuilder = function () {
    this.initialize = function (set) {
        this._set = set;
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
        var definition = this._set;
        var index, locationLength = location.length;
        popLength = popLength || 0;
        for (index = 0; index < locationLength - popLength; index++) {
            definition = definition.getChildAt(location[index]);
        }

        return definition;
    };

    this.initialize.apply(this, arguments);
};

exports.CandidatesBuilder = CandidatesBuilder;