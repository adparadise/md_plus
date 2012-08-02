

var TreeBuilder = function () {
    this.initialize = function (options, set) {
        this._options = options || {};
        this._set = set;

        this._rootObject = { children: [] };
        this._objectStack = [this._rootObject];
    };

    this.getObjects = function () {
        return this._rootObject.children;
    };

    this.get = function (key) {
        return this._options[key];
    };

    this.bakeDefinitions = function () {
        var treeBuilder = this;
        this._set.eachDefinition(function (definition) {
            var definedHandler = definition.get('handler');
            if (definedHandler) {
                // Allow the existing handler to stand.
                return;
            }
            definition.set('handler', TreeBuilder.callbackWrap(treeBuilder, '_matchHandler'));
        });
        this._set.bakeIDs();
    };

    this._popObjectStackTo = function (depth) {
        var index, stackLength = this._objectStack.length;
        for (index = stackLength; index > depth; index--) {
            this._objectStack.pop();
        }
    };

    this._createInstance = function (definition) {
        return {
            children: [],
            build: function (span, definition) {
                this.label = span.getMatchingElement().textContent;
            }
        };
    };

    this._delegateToInstance = function (instance, span, definition) {
        instance.build(span, definition);
    };

    this._appendToParent = function (parent, instance, definition) {
        parent.children.push(instance);
    };

    this._matchHandler = function (span, definition) {
        var depth = definition.getDepth();
        var instance = this._createInstance(definition);

        // Allow this instance to build itself from the parser 
        this._delegateToInstance(instance, span, definition);
        
        // Find the correct parent for this new instance
        this._popObjectStackTo(depth);
        this._appendToParent(this._objectStack[depth - 1], instance, definition);

        this._objectStack.push(instance);
    };

    this.initialize.apply(this, arguments);
};

TreeBuilder.callbackWrap = function (instance, methodName) {
    var method = instance[methodName];
    return function () {
        return method.apply(instance, arguments);
    };
};

exports.TreeBuilder = TreeBuilder;