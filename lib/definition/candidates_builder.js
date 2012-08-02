

var CandidatesBuilder = function () {
    this.initialize = function (set) {
        this._set = set;
    };

    this.getCandidatesAt = function (id) {
        var candidates = []
        var popLength, idLength = id.length;
        for (popLength = 0; popLength <= idLength; popLength++) {
            this._addCandidatesPeerTo(id, popLength, candidates);
        }
        
        return candidates;
    }

    this._addCandidatesPeerTo = function (id, popLength, candidates) {
        var offset, definitionCount, definition;
        var currentDefinition = this.getDefinitionAtID(id, popLength);
        if (!currentDefinition) {
            return;
        }
        definitionCount = currentDefinition.getDefinitionCount();
        for (offset = 0; offset < definitionCount; offset++) {
            definition = currentDefinition.getChildAt(offset);
            if (definition) {
                candidates.push(definition);
            }
        }
    };

    this.getDefinitionAtID = function (id, popLength) {
        var definition = this._set;
        var index, idLength = id.length;
        popLength = popLength || 0;
        for (index = 0; index < idLength - popLength; index++) {
            definition = definition.getChildAt(id[index]);
        }

        return definition;
    };

    this.initialize.apply(this, arguments);
};

exports.CandidatesBuilder = CandidatesBuilder;