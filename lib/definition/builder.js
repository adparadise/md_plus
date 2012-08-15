
var Definition = require('./definition.js').Definition;
var Set = require('./set.js').Set;

var Builder = function () {
    this.build = function (declarations) {
        var set = new Set(this.buildDefinitionList(declarations));
        set.bakeIDs();

        return set;
    };

    this.buildDefinitionList = function (declarations) {
        var definitions = [];
        var index, declarationsLength, declaration;
        declarationsLength = declarations.length;
        for (index = 0; index < declarationsLength; index++) {
            declaration = declarations[index];
            definitions.push(this.buildDefinition(declaration));
        }

        return definitions;
    };

    this.buildDefinition = function (declaration) {
        var children;
        if (declaration.children) {
            children = this.buildDefinitionList(declaration.children);
            declaration.children = children;
        }
        return new Definition(declaration);
    };
}

exports.Builder = Builder;