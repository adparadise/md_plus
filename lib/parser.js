
DomTreeIterator = require('./dom_tree_iterator.js').DomTreeIterator;
Definition = require('./definition.js').Definition;

exports.Parser = function () {
    this.initialize = function (container, definition) {
        this._container = container;
        this._definition = definition;
    };

    this.parse = function () {
        var iterator = new DomTreeIterator(this._container);
        var candidatesBuilder = new Definition.CandidatesBuilder(this._definition);
        var candidates;
        var priorMatchDefinition;
        var currentMatchDefinition;
        var currentLocation = [];
        var element;

        candidates = candidatesBuilder.getCandidatesAt(currentLocation);
        while (true) {
            element = iterator.elementAtLocation(currentLocation);

            currentMatchDefinition = this._findMatchInCandidates(element, candidates);
            if (currentMatchDefinition) {
                if (priorMatchDefinition) {

                }

                priorMatchDefinition = currentMatchDefinition;
                currentLocation = currentMatchDefinition.getLocation();
                candidates = candidatesBuilder.getCandidatesAt(currentLocation);
            }

            currentLocation = iterator.next(currentLocation);
            if (currentLocation.length === 0) {
                break;
            }
        }

        if (priorMatchDefinition) {
            
        }

    };

    this._findMatchInCandidates = function (element, candidates) {
        var index, candidatesLength = candidates.length;
        var definition;
        var matchedDefinition;

        for (index = 0; index < candidatesLength; index++) {
            definition = candidates[index];

            if (definition.match(element)) {
                matchedDefinition = definition;
                break;
            }
        }

        return matchedDefinition;
    }
    
    this.initialize.apply(this, arguments);
};