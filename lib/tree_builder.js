

var TreeBuilder = function () {
    this.initialize = function (options, set) {
        this._options = options || {};
        this._set = set;

        this._rootObject = [];
        this._objectStack = [this._rootObject];
    };

    this.getObjects = function () {
        return this._rootObject;
    };

    this.getOverridden = function (key, definition, defaultValue) {
        var value = definition.get(key);
        if (value === undefined) {
            value = this.get(key);
        }
        if (value === undefined) {
            value = defaultValue;
        }
        return value;
    }

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
            definition.set('context', treeBuilder);
            definition.set('handler', treeBuilder._matchHandler);
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
        var classRef = this.getOverridden('classRef', definition);
        return new classRef();
    };

    this._delegateToInstance = function (instance, span, definition) {
        instance.build(span, definition);
    };

    this._appendToParent = function (parent, instance, definition) {
        var appendMethodName;
        if (definition.getDepth() === 1) {
            parent.push(instance);
        } else {
            var appendMethodName = this.getOverridden('appendMethodName', definition, 'push');
            parent[appendMethodName](instance);
        }
    };

    this._matchHandler = function (span, definition) {
        var depth = definition.getDepth();
        var instance = this._createInstance(definition);

        // Allow this instance to build itself from the parser.
        this._delegateToInstance(instance, span, definition);
        
        // Find the correct parent for this new instance.
        this._popObjectStackTo(depth);

        // Add instance to parent and to the object stack.
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